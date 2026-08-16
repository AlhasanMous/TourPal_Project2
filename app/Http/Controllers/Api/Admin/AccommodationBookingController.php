<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\AccommodationBookingResource;
use App\Models\AccommodationBooking;
use App\Services\Admin\AdminAccommodationBookingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AccommodationBookingController extends Controller
{
    public function __construct(
        private AdminAccommodationBookingService $bookingService
    ) {}

    // GET /api/admin/accommodation-bookings
    public function index(Request $request): JsonResponse
    {
        $bookings = $this->bookingService->getAll(
            $request->only(['status', 'accommodation_id', 'tourist_id'])
        );

        return response()->json([
            'bookings' => AccommodationBookingResource::collection($bookings),
            'meta'     => [
                'current_page' => $bookings->currentPage(),
                'last_page'    => $bookings->lastPage(),
                'per_page'     => $bookings->perPage(),
                'total'        => $bookings->total(),
            ],
        ]);
    }

    // GET /api/admin/accommodation-bookings/{booking}
    public function show(int $id): JsonResponse
    {
        $booking = $this->bookingService->findById($id);

        return response()->json([
            'booking' => new AccommodationBookingResource($booking),
        ]);
    }

    // PATCH /api/admin/accommodation-bookings/{booking}/cancel
    public function cancel(AccommodationBooking $booking): JsonResponse
    {
        if ($booking->status === 'cancelled') {
            return response()->json([
                'message' => 'الحجز ملغى مسبقاً',
            ], 422);
        }

        $booking = $this->bookingService->cancel($booking);

        return response()->json([
            'message' => 'تم إلغاء الحجز بنجاح من قبل الإدارة',
            'booking' => new AccommodationBookingResource($booking),
        ]);
    }
}