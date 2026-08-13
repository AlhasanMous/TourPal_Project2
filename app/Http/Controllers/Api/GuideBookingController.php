<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Booking\StoreGuideBookingRequest;
use App\Http\Requests\Booking\UpdateGuideBookingRequest;
use App\Http\Resources\GuideBookingResource;
use App\Models\GuideBooking;
use App\Services\GuideBookingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GuideBookingController extends Controller
{
    public function __construct(private GuideBookingService $bookingService) {}

    // ─────────────────────────────────────────
    // POST /guide-bookings
    // Tourist يحجز مرشد
    // ─────────────────────────────────────────
    public function store(StoreGuideBookingRequest $request): JsonResponse
    {
        $booking = $this->bookingService->book(
            $request->user()->id,
            $request->validated()
        );

        return response()->json([
            'message' => 'تم إرسال طلب الحجز بنجاح، في انتظار موافقة المرشد',
            'booking' => new GuideBookingResource($booking->load(['guide.user', 'guide.city'])),
        ], 201);
    }

    // ─────────────────────────────────────────
    // GET /guide-bookings
    // Tourist يشوف حجوزاته
    // ─────────────────────────────────────────
    public function myBookings(Request $request): JsonResponse
    {
        $bookings = $this->bookingService->myBookings(
            $request->user()->id,
            $request->only(['status'])
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

    // ─────────────────────────────────────────
    // GET /guide-bookings/requests
    // Guide يشوف طلبات الحجز الواردة
    // ─────────────────────────────────────────
    public function guideRequests(Request $request): JsonResponse
    {
        $bookings = $this->bookingService->guideBookings(
            $request->user()->id,
            $request->only(['status'])
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

    // ─────────────────────────────────────────
    // PATCH /guide-bookings/{booking}/respond
    // Guide يقبل أو يرفض الحجز
    // ─────────────────────────────────────────
    public function respond(
        UpdateGuideBookingRequest $request,
        GuideBooking $booking
    ): JsonResponse {
        $booking = $this->bookingService->respond(
            $booking,
            $request->validated()['status'],
            $request->user()->id
        );

        $message = match($booking->status) {
            'accepted' => 'تم قبول طلب الحجز',
            'declined' => 'تم رفض طلب الحجز',
            default    => 'تم تحديث حالة الحجز',
        };

        return response()->json([
            'message' => $message,
            'booking' => new GuideBookingResource($booking->load(['guide.user', 'tourist'])),
        ]);
    }

    // ─────────────────────────────────────────
    // PATCH /guide-bookings/{booking}/cancel
    // Tourist يلغي الحجز
    // ─────────────────────────────────────────
    public function cancel(GuideBooking $booking, Request $request): JsonResponse
    {
        $booking = $this->bookingService->cancel(
            $booking,
            $request->user()->id
        );

        return response()->json([
            'message' => 'تم إلغاء الحجز بنجاح',
            'booking' => new GuideBookingResource($booking),
        ]);
    }
}