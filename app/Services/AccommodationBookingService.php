<?php

namespace App\Services;

use App\Models\Accommodation;
use App\Models\AccommodationBooking;
use App\Models\Workspace;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class AccommodationBookingService
{
    // ─────────────────────────────────────────
    // حجز إقامة — Tourist
    // ─────────────────────────────────────────
    public function book(int $touristId, array $data): AccommodationBooking
    {
        $accommodation = Accommodation::findOrFail($data['accommodation_id']);

        // تحقق إن الإقامة معتمدة
        if ($accommodation->verification_status !== 'approved') {
            throw ValidationException::withMessages([
                'accommodation_id' => ['هذه الإقامة غير متاحة للحجز'],
            ]);
        }

        // تحقق من التداخل في التواريخ
        $this->checkDateOverlap(
            $data['accommodation_id'],
            $data['check_in'],
            $data['check_out'],
            $data['room_type']
        );

        // تحقق من السعة للـ Shared
        if ($data['room_type'] === 'shared') {
            $this->checkSharedCapacity(
                $accommodation,
                $data['check_in'],
                $data['check_out']
            );
        }

        // تحقق إن الـ workspace_id يخص السائح
        if (!empty($data['workspace_id'])) {
            $workspace = Workspace::find($data['workspace_id']);
            if (!$workspace || $workspace->owner_user_id !== $touristId) {
                throw ValidationException::withMessages([
                    'workspace_id' => ['مساحة العمل غير موجودة أو لا تخصك'],
                ]);
            }
        }

        return DB::transaction(function () use ($touristId, $data) {
            return AccommodationBooking::create([
                'tourist_user_id'  => $touristId,
                'accommodation_id' => $data['accommodation_id'],
                'check_in'         => $data['check_in'],
                'check_out'        => $data['check_out'],
                'room_type'        => $data['room_type'],
                'status'           => 'pending',
                'workspace_id'     => $data['workspace_id'] ?? null,
            ]);
        });
    }

    // ─────────────────────────────────────────
    // رد المضيف على الحجز — Host
    // ─────────────────────────────────────────
    public function respond(
        AccommodationBooking $booking,
        string $status,
        int $hostUserId
    ): AccommodationBooking {
        // تحقق إن المضيف هو صاحب الإقامة
        if ($booking->accommodation->host_user_id !== $hostUserId) {
            throw ValidationException::withMessages([
                'booking' => ['ليس لديك صلاحية للرد على هذا الحجز'],
            ]);
        }

        // بس يرد على الحجوزات المعلقة
        if ($booking->status !== 'pending') {
            throw ValidationException::withMessages([
                'booking' => ['لا يمكن تغيير حالة حجز تمت معالجته مسبقاً'],
            ]);
        }

        $booking->update(['status' => $status]);
        return $booking->fresh();
    }

    // ─────────────────────────────────────────
    // إلغاء الحجز — Tourist
    // ─────────────────────────────────────────
    public function cancel(
        AccommodationBooking $booking,
        int $touristId
    ): AccommodationBooking {
        if ($booking->tourist_user_id !== $touristId) {
            throw ValidationException::withMessages([
                'booking' => ['ليس لديك صلاحية لإلغاء هذا الحجز'],
            ]);
        }

        if (!in_array($booking->status, ['pending', 'accepted'])) {
            throw ValidationException::withMessages([
                'booking' => ['لا يمكن إلغاء هذا الحجز'],
            ]);
        }

        $booking->update(['status' => 'cancelled']);
        return $booking->fresh();
    }

    // ─────────────────────────────────────────
    // حجوزاتي — Tourist
    // ─────────────────────────────────────────
    public function myBookings(
        int $touristId,
        array $filters = []
    ): LengthAwarePaginator {
        $query = AccommodationBooking::with([
            'accommodation.city',
            'accommodation.images',
        ])->where('tourist_user_id', $touristId);

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        return $query->latest('check_in')->paginate(15);
    }

    // ─────────────────────────────────────────
    // طلبات الحجز — Host
    // ─────────────────────────────────────────
    public function hostBookings(
        int $hostUserId,
        array $filters = []
    ): LengthAwarePaginator {
        $query = AccommodationBooking::with(['tourist', 'accommodation'])
            ->whereHas('accommodation', fn($q) =>
                $q->where('host_user_id', $hostUserId)
            );

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['accommodation_id'])) {
            $query->where('accommodation_id', $filters['accommodation_id']);
        }

        return $query->latest('check_in')->paginate(15);
    }

    // ─────────────────────────────────────────
    // Helpers
    // ─────────────────────────────────────────
    private function checkDateOverlap(
        int $accommodationId,
        string $checkIn,
        string $checkOut,
        string $roomType
    ): void {
        $query = AccommodationBooking::where('accommodation_id', $accommodationId)
            ->whereIn('status', ['pending', 'accepted'])
            ->where('check_in',  '<', $checkOut)
            ->where('check_out', '>', $checkIn);

        // للـ Private: أي تداخل ممنوع
        if ($roomType === 'private') {
            if ($query->exists()) {
                throw ValidationException::withMessages([
                    'check_in' => ['هذه الإقامة محجوزة في التواريخ المحددة'],
                ]);
            }
        }
    }

    private function checkSharedCapacity(
        Accommodation $accommodation,
        string $checkIn,
        string $checkOut
    ): void {
        // عدد الحجوزات النشطة المتداخلة مع هاد الوقت
        $activeBookings = AccommodationBooking::where('accommodation_id', $accommodation->id)
            ->whereIn('status', ['pending', 'accepted'])
            ->where('check_in',  '<', $checkOut)
            ->where('check_out', '>', $checkIn)
            ->count();

        if ($activeBookings >= $accommodation->capacity) {
            throw ValidationException::withMessages([
                'check_in' => [
                    "لا توجد أسرّة متاحة في التواريخ المحددة — السعة الكاملة محجوزة"
                ],
            ]);
        }
    }
}