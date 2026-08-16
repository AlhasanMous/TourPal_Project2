<?php

namespace App\Services\Admin;

use App\Models\AccommodationBooking;
use Illuminate\Pagination\LengthAwarePaginator;

class AdminAccommodationBookingService
{
    // ─────────────────────────────────────────
    // جلب كل الحجوزات
    // ─────────────────────────────────────────
    public function getAll(array $filters = []): LengthAwarePaginator
    {
        $query = AccommodationBooking::with([
            'tourist',
            'accommodation.city',
            'accommodation.images',
        ]);

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['accommodation_id'])) {
            $query->where('accommodation_id', $filters['accommodation_id']);
        }

        if (!empty($filters['tourist_id'])) {
            $query->where('tourist_user_id', $filters['tourist_id']);
        }

        return $query->latest('check_in')->paginate(20);
    }

    // ─────────────────────────────────────────
    // تفاصيل حجز معين
    // ─────────────────────────────────────────
    public function findById(int $id): AccommodationBooking
    {
        return AccommodationBooking::with([
            'tourist',
            'accommodation.city',
            'accommodation.host',
            'accommodation.images',
        ])->findOrFail($id);
    }

    // ─────────────────────────────────────────
    // إلغاء حجز من الـ Admin
    // ─────────────────────────────────────────
    public function cancel(AccommodationBooking $booking): AccommodationBooking
    {
        $booking->update(['status' => 'cancelled']);
        return $booking->fresh();
    }
}