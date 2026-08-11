<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Workspace\AddPlaceRequest;
use App\Http\Resources\PlaceResource;
use App\Models\Workspace;
use App\Models\WorkspacePlace;
use App\Services\WorkspacePlaceService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\JsonResponse;

class WorkspacePlaceController extends Controller
{
    use AuthorizesRequests;

    public function __construct(private WorkspacePlaceService $placeService) {}

    // GET /api/workspaces/{workspace}/places
    public function index(Workspace $workspace): JsonResponse
    {
        $this->authorize('view', $workspace);

        $places = $this->placeService->getPlaces($workspace);

        return response()->json([
            'places' => $places->map(fn($wp) => [
                'workspace_place_id' => $wp->id,
                'added_at'           => $wp->created_at,
                'place'              => new PlaceResource($wp->place),
            ]),
        ]);
    }

    // POST /api/workspaces/{workspace}/places
    public function store(AddPlaceRequest $request, Workspace $workspace): JsonResponse
    {
        $this->authorize('update', $workspace);

        try {
            $workspacePlace = $this->placeService->addPlace(
                $workspace,
                $request->place_id,
                $request->user()->id
            );

            return response()->json([
                'message'            => 'تم إضافة المكان للرحلة بنجاح',
                'workspace_place_id' => $workspacePlace->id,
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    // DELETE /api/workspaces/{workspace}/places/{place}
    public function destroy(Workspace $workspace, int $placeId): JsonResponse
    {
        $this->authorize('update', $workspace);

        try {
            $this->placeService->removePlace($workspace, $placeId);

            return response()->json([
                'message' => 'تم إزالة المكان من الرحلة بنجاح',
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'المكان غير موجود في هذه الرحلة',
            ], 404);
        }
    }
}