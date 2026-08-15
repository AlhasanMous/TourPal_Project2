<?php

namespace App\Services;

use App\Models\Guide;
use App\Models\GuideBooking;
use App\Models\Workspace;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class GuideBookingService
{
    // ─────────────────────────────────────────
    // حجز مرشد — Tourist
    // ─────────────────────────────────────────
    public function book(int $touristId, array $data): GuideBooking
    {
        $guide = Guide::findOrFail($data['guide_id']);

        // تحقق إن المرشد معتمد
        if ($guide->verification_status !== 'approved') {
            throw ValidationException::withMessages([
                'guide_id' => ['هذا المرشد غير معتمد من الإدارة'],
            ]);
        }

        // تحقق من تداخل الأوقات
        $this->checkTimeOverlap(
            $data['guide_id'],
            $data['booking_date'],
            $data['start_time'],
            $data['end_time']
        );

        // تحقق إن الـ workspace_id يخص السائح نفسه
        if (!empty($data['workspace_id'])) {
            $workspace = Workspace::find($data['workspace_id']);
            if (!$workspace || $workspace->owner_user_id !== $touristId) {
                throw ValidationException::withMessages([
                    'workspace_id' => ['مساحة العمل غير موجودة أو لا تخصك'],
                ]);
            }
        }

        return DB::transaction(function () use ($touristId, $data) {
            return GuideBooking::create([
                'tourist_user_id' => $touristId,
                'guide_id'        => $data['guide_id'],
                'booking_date'    => $data['booking_date'],
                'start_time'      => $data['start_time'],
                'end_time'        => $data['end_time'],
                'status'          => 'pending',
                'workspace_id'    => $data['workspace_id'] ?? null,
            ]);
        });
    }

    // ─────────────────────────────────────────
    // رد المرشد على الحجز — Guide
    // ─────────────────────────────────────────
    public function respond(GuideBooking $booking, string $status, int $guideUserId): GuideBooking
    {
        // تحقق إن المرشد هو صاحب الحجز
        if ($booking->guide->user_id !== $guideUserId) {
            throw ValidationException::withMessages([
                'booking' => ['ليس لديك صلاحية للرد على هذا الحجز'],
            ]);
        }

        // بس يقدر يرد على الحجوزات المعلقة
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
    public function cancel(GuideBooking $booking, int $touristId): GuideBooking
    {
        // تحقق إن السائح هو صاحب الحجز
        if ($booking->tourist_user_id !== $touristId) {
            throw ValidationException::withMessages([
                'booking' => ['ليس لديك صلاحية لإلغاء هذا الحجز'],
            ]);
        }

        // بس يقدر يلغي الحجوزات المعلقة أو المقبولة
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
    public function myBookings(int $touristId, array $filters = []): LengthAwarePaginator
    {
        $query = GuideBooking::with(['guide.user', 'guide.city', 'guide.mainImage'])
            ->where('tourist_user_id', $touristId);

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        return $query->latest('booking_date')->paginate(15);
    }

    // ─────────────────────────────────────────
    // طلبات الحجز — Guide
    // ─────────────────────────────────────────
    public function guideBookings(int $guideUserId, array $filters = []): LengthAwarePaginator
    {
        $guide = Guide::where('user_id', $guideUserId)->firstOrFail();

        $query = GuideBooking::with(['tourist'])
            ->where('guide_id', $guide->id);

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        return $query->latest('booking_date')->paginate(15);
    }

    // ─────────────────────────────────────────
    // Helper — تحقق من تداخل الأوقات
    // ─────────────────────────────────────────
    private function checkTimeOverlap(
        int $guideId,
        string $date,
        string $startTime,
        string $endTime
    ): void {
        $overlap = GuideBooking::where('guide_id', $guideId)
            ->where('booking_date', $date)
            ->whereIn('status', ['pending', 'accepted'])
            ->where('start_time', '<', $endTime)
            ->where('end_time', '>', $startTime)
            ->exists();

        if ($overlap) {
            throw ValidationException::withMessages([
                'booking_date' => ['المرشد محجوز في هذا الوقت، يرجى اختيار وقت آخر'],
            ]);
        }
    }
}
