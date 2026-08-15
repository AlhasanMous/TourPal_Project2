<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\AccommodationResource;
use App\Models\Accommodation;
use App\Services\AccommodationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AccommodationController extends Controller
{
    public function __construct(private AccommodationService $accommodationService) {}

    // GET /api/accommodations
    public function index(Request $request): JsonResponse
    {
        $accommodations = $this->accommodationService->getAll(
            $request->only(['city_id', 'type'])
        );

        return response()->json([
            'accommodations' => AccommodationResource::collection($accommodations),
            'meta'           => [
                'current_page' => $accommodations->currentPage(),
                'last_page'    => $accommodations->lastPage(),
                'per_page'     => $accommodations->perPage(),
                'total'        => $accommodations->total(),
            ],
        ]);
    }

    // GET /api/accommodations/{accommodation}
    public function show(Accommodation $accommodation): JsonResponse
    {
        if ($accommodation->verification_status !== 'approved') {
            return response()->json([
                'message' => 'هذا المكان غير متاح',
            ], 404);
        }

        $accommodation->load(['city', 'images', 'host']);

        return response()->json([
            'accommodation' => new AccommodationResource($accommodation),
        ]);
    }
}