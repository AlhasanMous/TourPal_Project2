<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreTransportRouteRequest;
use App\Http\Resources\TransportRouteResource;
use App\Models\TransportRoute;
use App\Services\Admin\AdminTransportService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TransportRouteController extends Controller
{
    public function __construct(private AdminTransportService $transportService) {}

    // GET /api/admin/transport/routes
    public function index(Request $request): JsonResponse
    {
        $routes = $this->transportService->getAllRoutes($request->only([
            'company_id', 'origin_city_id', 'destination_city_id',
            'transport_type', 'is_active',
        ]));

        return response()->json([
            'routes' => TransportRouteResource::collection($routes),
            'meta'   => [
                'current_page' => $routes->currentPage(),
                'last_page'    => $routes->lastPage(),
                'per_page'     => $routes->perPage(),
                'total'        => $routes->total(),
            ],
        ]);
    }

    // POST /api/admin/transport/routes
    public function store(StoreTransportRouteRequest $request): JsonResponse
    {
        $route = $this->transportService->createRoute($request->validated());
        $route->load(['company', 'originCity', 'destinationCity']);

        return response()->json([
            'message' => 'تم إضافة المسار بنجاح',
            'route'   => new TransportRouteResource($route),
        ], 201);
    }

    // PUT /api/admin/transport/routes/{route}
    public function update(StoreTransportRouteRequest $request, TransportRoute $route): JsonResponse
    {
        $route = $this->transportService->updateRoute($route, $request->validated());

        return response()->json([
            'message' => 'تم تحديث المسار بنجاح',
            'route'   => new TransportRouteResource($route),
        ]);
    }

    // DELETE /api/admin/transport/routes/{route}
    public function destroy(TransportRoute $route): JsonResponse
    {
        $this->transportService->deleteRoute($route);

        return response()->json([
            'message' => 'تم حذف المسار بنجاح',
        ]);
    }
}