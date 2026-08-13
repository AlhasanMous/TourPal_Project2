<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\WorkspaceResource;
use App\Http\Resources\WorkspaceSuggestionResource;
use App\Models\Workspace;
use App\Services\Admin\AdminWorkspaceService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WorkspaceController extends Controller
{
    public function __construct(private AdminWorkspaceService $workspaceService) {}

    // GET /api/admin/workspaces
    public function index(Request $request): JsonResponse
    {
        $workspaces = $this->workspaceService->getAll($request->only([
            'search', 'is_public',
        ]));

        return response()->json([
            'workspaces' => WorkspaceResource::collection($workspaces),
            'meta'       => [
                'current_page' => $workspaces->currentPage(),
                'last_page'    => $workspaces->lastPage(),
                'per_page'     => $workspaces->perPage(),
                'total'        => $workspaces->total(),
            ],
        ]);
    }

    // GET /api/admin/workspaces/{workspace}
    public function show(int $id): JsonResponse
    {
        $workspace = $this->workspaceService->findById($id);

        return response()->json([
            'workspace' => new WorkspaceResource($workspace),
        ]);
    }

    // GET /api/admin/workspaces/{workspace}/participants
    public function participants(Workspace $workspace): JsonResponse
    {
        $data = $this->workspaceService->getParticipants($workspace);

        return response()->json([
            'workspace_id' => $workspace->id,
            'workspace_name' => $workspace->name,
            'total_members'  => count($data['participants']) + 1,
            ...$data,
        ]);
    }

    // GET /api/admin/workspaces/{workspace}/places
    public function places(Workspace $workspace): JsonResponse
    {
        $places = $this->workspaceService->getPlaces($workspace);

        return response()->json([
            'workspace_id'  => $workspace->id,
            'workspace_name'=> $workspace->name,
            'total_places'  => $places->count(),
            'places'        => $places,
        ]);
    }

    // GET /api/admin/workspaces/{workspace}/timeline
    public function timeline(Workspace $workspace): JsonResponse
    {
        $timeline = $this->workspaceService->getTimeline($workspace);

        return response()->json([
            'workspace_id'  => $workspace->id,
            'workspace_name'=> $workspace->name,
            'timeline'      => $timeline,
        ]);
    }

    // GET /api/admin/workspaces/{workspace}/suggestions
    public function suggestions(Workspace $workspace): JsonResponse
    {
        $suggestions = $this->workspaceService->getSuggestions($workspace);

        return response()->json([
            'workspace_id'    => $workspace->id,
            'workspace_name'  => $workspace->name,
            'total'           => $suggestions->count(),
            'pending'         => $suggestions->where('status', 'pending')->count(),
            'suggestions'     => WorkspaceSuggestionResource::collection($suggestions),
        ]);
    }

    // DELETE /api/admin/workspaces/{workspace}
    public function destroy(Workspace $workspace): JsonResponse
    {
        $this->workspaceService->delete($workspace);

        return response()->json([
            'message' => 'تم حذف مساحة العمل بنجاح',
        ]);
    }
}