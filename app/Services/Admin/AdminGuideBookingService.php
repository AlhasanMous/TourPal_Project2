<?php

namespace App\Services\Admin;

use App\Models\GuideBooking;
use Illuminate\Pagination\LengthAwarePaginator;

class AdminGuideBookingService
{
    public function getAll(array $filters = []): LengthAwarePaginator
    {
        $query = GuideBooking::with([
            'tourist',
            'guide.user',
            'guide.city',
        ]);

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['guide_id'])) {
            $query->where('guide_id', $filters['guide_id']);
        }

        if (!empty($filters['tourist_id'])) {
            $query->where('tourist_user_id', $filters['tourist_id']);
        }

        return $query->latest('booking_date')->paginate(20);
    }

    public function findById(int $id): GuideBooking
    {
        return GuideBooking::with([
            'tourist',
            'guide.user',
            'guide.city',
            'workspace',
        ])->findOrFail($id);
    }

    public function cancel(GuideBooking $booking): GuideBooking
    {
        if ($booking->status === 'cancelled') {
            throw \Illuminate\Validation\ValidationException::withMessages([
                'booking' => ['الحجز ملغى مسبقاً'],
            ]);
        }

        $booking->update(['status' => 'cancelled']);
        return $booking->fresh();
    }
}