<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\WorkspaceResource;
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
            'search',
            'is_public',
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

    // DELETE /api/admin/workspaces/{workspace}
    public function destroy(Workspace $workspace): JsonResponse
    {
        $this->workspaceService->delete($workspace);

        return response()->json([
            'message' => 'تم حذف مساحة العمل بنجاح',
        ]);
    }
}