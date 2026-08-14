<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreAccommodationRequest;
use App\Http\Requests\Admin\VerifyAccommodationRequest;
use App\Http\Resources\Admin\AdminAccommodationResource;
use App\Models\Accommodation;
use App\Services\Admin\AdminAccommodationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AccommodationController extends Controller
{
    public function __construct(private AdminAccommodationService $accommodationService) {}

    public function index(Request $request): JsonResponse
    {
        $accommodations = $this->accommodationService->getAll($request->only([
            'status', 'city_id', 'type', 'search',
        ]));

        return response()->json([
            'accommodations' => AdminAccommodationResource::collection($accommodations),
            'meta' => [
                'current_page' => $accommodations->currentPage(),
                'last_page'    => $accommodations->lastPage(),
                'per_page'     => $accommodations->perPage(),
                'total'        => $accommodations->total(),
            ],
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $accommodation = $this->accommodationService->findById($id);

        return response()->json([
            'accommodation' => new AdminAccommodationResource($accommodation),
        ]);
    }

    public function pending(): JsonResponse
    {
        $accommodations = $this->accommodationService->getPending();

        return response()->json([
            'accommodations' => AdminAccommodationResource::collection($accommodations),
            'meta' => [
                'current_page' => $accommodations->currentPage(),
                'last_page'    => $accommodations->lastPage(),
                'per_page'     => $accommodations->perPage(),
                'total'        => $accommodations->total(),
            ],
        ]);
    }

    public function store(StoreAccommodationRequest $request): JsonResponse
    {
        $accommodation = $this->accommodationService->create($request->validated());
        $accommodation->load(['host', 'city']);

        return response()->json([
            'message'       => 'تم إنشاء الإقامة بنجاح',
            'accommodation' => new AdminAccommodationResource($accommodation),
        ], 201);
    }

    public function verify(VerifyAccommodationRequest $request, Accommodation $accommodation): JsonResponse
    {
        try {
            $accommodation = $this->accommodationService->verify(
                $accommodation,
                $request->action,
                $request->rejection_reason
            );

            $message = $request->action === 'verify'
                ? 'تم اعتماد الإقامة بنجاح'
                : 'تم رفض الإقامة';

            return response()->json([
                'message'       => $message,
                'accommodation' => new AdminAccommodationResource($accommodation),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 422);
        }
    }
}