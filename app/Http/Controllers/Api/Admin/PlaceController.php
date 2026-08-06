<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Place\StorePlaceRequest;
use App\Http\Resources\PlaceResource;
use App\Models\Place;
use App\Services\PlaceService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PlaceController extends Controller
{
    public function __construct(private PlaceService $placeService) {}

    // GET /api/admin/places
    public function index(Request $request): JsonResponse
    {
        $places = $this->placeService->getAll($request->only([
            'city_id',
            'category',
            'sort',
        ]));

        return response()->json([
            'places' => PlaceResource::collection($places),
            'meta'   => [
                'current_page' => $places->currentPage(),
                'last_page'    => $places->lastPage(),
                'per_page'     => $places->perPage(),
                'total'        => $places->total(),
            ],
        ]);
    }

    // GET /api/admin/places/{place}
    public function show(Place $place): JsonResponse
    {
        $place->load(['city', 'images']);

        return response()->json([
            'place' => new PlaceResource($place),
        ]);
    }

    // POST /api/admin/places
    public function store(StorePlaceRequest $request): JsonResponse
    {
        $place = $this->placeService->create(
            $request->validated(),
            $request->user()->id
        );

        return response()->json([
            'message' => 'تم إضافة المكان بنجاح',
            'place'   => new PlaceResource($place),
        ], 201);
    }

    // PUT /api/admin/places/{place}
    public function update(StorePlaceRequest $request, Place $place): JsonResponse
    {
        $place = $this->placeService->update($place, $request->validated());

        return response()->json([
            'message' => 'تم تحديث المكان بنجاح',
            'place'   => new PlaceResource($place),
        ]);
    }

    // DELETE /api/admin/places/{place}
    public function destroy(Place $place): JsonResponse
    {
        $this->placeService->delete($place);

        return response()->json([
            'message' => 'تم حذف المكان بنجاح',
        ]);
    }
}