<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\City\StoreCityRequest;
use App\Http\Resources\CityResource;
use App\Models\City;
use App\Services\CityService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CityController extends Controller
{
    public function __construct(private CityService $cityService) {}

    // GET /api/admin/cities
    // GET /api/admin/cities?search=دمشق
    public function index(Request $request): JsonResponse
    {
        $cities = $this->cityService->getAll($request->only(['search']));

        return response()->json([
            'cities' => CityResource::collection($cities),
            'meta'   => [
                'current_page' => $cities->currentPage(),
                'last_page'    => $cities->lastPage(),
                'per_page'     => $cities->perPage(),
                'total'        => $cities->total(),
            ],
        ]);
    }

    // GET /api/admin/cities/{city}
    public function show(City $city): JsonResponse
    {
        $city->loadCount('places');

        return response()->json([
            'city' => new CityResource($city),
        ]);
    }

    // POST /api/admin/cities
    public function store(StoreCityRequest $request): JsonResponse
    {
        $city = $this->cityService->create($request->validated());

        return response()->json([
            'message' => 'تم إضافة المدينة بنجاح',
            'city'    => new CityResource($city),
        ], 201);
    }

    // PUT /api/admin/cities/{city}
    public function update(StoreCityRequest $request, City $city): JsonResponse
    {
        $city = $this->cityService->update($city, $request->validated());

        return response()->json([
            'message' => 'تم تحديث المدينة بنجاح',
            'city'    => new CityResource($city),
        ]);
    }

    // DELETE /api/admin/cities/{city}
    public function destroy(City $city): JsonResponse
    {
        $this->cityService->delete($city);

        return response()->json([
            'message' => 'تم حذف المدينة بنجاح',
        ]);
    }
}