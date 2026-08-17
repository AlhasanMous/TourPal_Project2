<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\GuideBookingResource;
use App\Models\GuideBooking;
use App\Services\Admin\AdminGuideBookingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GuideBookingController extends Controller
{
    public function __construct(
        private AdminGuideBookingService $bookingService
    ) {}

    // GET /api/admin/guide-bookings
    public function index(Request $request): JsonResponse
    {
        $bookings = $this->bookingService->getAll(
            $request->only(['status', 'guide_id', 'tourist_id'])
        );

        return response()->json([
            'bookings' => GuideBookingResource::collection($bookings),
            'meta'     => [
                'current_page' => $bookings->currentPage(),
                'last_page'    => $bookings->lastPage(),
                'per_page'     => $bookings->perPage(),
                'total'        => $bookings->total(),
            ],
        ]);
    }

    // GET /api/admin/guide-bookings/{booking}
    public function show(int $id): JsonResponse
    {
        $booking = $this->bookingService->findById($id);

        return response()->json([
            'booking' => new GuideBookingResource($booking),
        ]);
    }

    // PATCH /api/admin/guide-bookings/{booking}/cancel
    public function cancel(GuideBooking $booking): JsonResponse
    {
        $booking = $this->bookingService->cancel($booking);

        return response()->json([
            'message' => 'تم إلغاء الحجز بنجاح من قبل الإدارة',
            'booking' => new GuideBookingResource($booking),
        ]);
    }
}