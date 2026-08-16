<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Booking\StoreAccommodationBookingRequest;
use App\Http\Requests\Booking\UpdateAccommodationBookingRequest;
use App\Http\Resources\AccommodationBookingResource;
use App\Models\AccommodationBooking;
use App\Services\AccommodationBookingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AccommodationBookingController extends Controller
{
    public function __construct(
        private AccommodationBookingService $bookingService
    ) {}

    // ─────────────────────────────────────────
    // POST /api/accommodation-bookings
    // Tourist يحجز إقامة
    // ─────────────────────────────────────────
    public function store(StoreAccommodationBookingRequest $request): JsonResponse
    {
        $booking = $this->bookingService->book(
            $request->user()->id,
            $request->validated()
        );

        return response()->json([
            'message' => 'تم إرسال طلب الحجز بنجاح، في انتظار موافقة المضيف',
            'booking' => new AccommodationBookingResource(
                $booking->load(['accommodation.city', 'accommodation.images'])
            ),
        ], 201);
    }

    // ─────────────────────────────────────────
    // GET /api/accommodation-bookings
    // Tourist يشوف حجوزاته
    // ─────────────────────────────────────────
    public function myBookings(Request $request): JsonResponse
    {
        $bookings = $this->bookingService->myBookings(
            $request->user()->id,
            $request->only(['status'])
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

    // ─────────────────────────────────────────
    // GET /api/host/accommodation-bookings
    // Host يشوف الطلبات الواردة
    // ─────────────────────────────────────────
    public function hostBookings(Request $request): JsonResponse
    {
        $bookings = $this->bookingService->hostBookings(
            $request->user()->id,
            $request->only(['status', 'accommodation_id'])
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

    // ─────────────────────────────────────────
    // PATCH /api/accommodation-bookings/{booking}/respond
    // Host يقبل أو يرفض
    // ─────────────────────────────────────────
    public function respond(
        UpdateAccommodationBookingRequest $request,
        AccommodationBooking $booking
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
            'booking' => new AccommodationBookingResource(
                $booking->load(['accommodation', 'tourist'])
            ),
        ]);
    }

    // ─────────────────────────────────────────
    // PATCH /api/accommodation-bookings/{booking}/cancel
    // Tourist يلغي
    // ─────────────────────────────────────────
    public function cancel(
        Request $request,
        AccommodationBooking $booking
    ): JsonResponse {
        $booking = $this->bookingService->cancel(
            $booking,
            $request->user()->id
        );

        return response()->json([
            'message' => 'تم إلغاء الحجز بنجاح',
            'booking' => new AccommodationBookingResource($booking),
        ]);
    }
}