<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\Workspace\StoreWorkspaceRequest;
use App\Http\Requests\Workspace\UpdateWorkspaceRequest;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests; 

use App\Http\Resources\WorkspaceResource;
use App\Models\Workspace;
use App\Services\WorkspaceService;
use Illuminate\Http\JsonResponse;
class WorkspaceController extends Controller
{
      use AuthorizesRequests; 
    //
    public function __construct(private WorkspaceService $workspaceService) {}

    // GET /api/workspaces
    public function index(Request $request): JsonResponse
    {
        $workspaces = $this->workspaceService->getUserWorkspaces($request->user()->id);

        return response()->json([
            'workspaces' => WorkspaceResource::collection($workspaces),
        ]);
    }

    // GET /api/workspaces/{workspace}
    public function show(Workspace $workspace): JsonResponse
    {
        $this->authorize('view', $workspace);

        $workspace->load(['owner', 'participants']);

        return response()->json([
            'workspace' => new WorkspaceResource($workspace),
        ]);
    }

    // POST /api/workspaces
    public function store(StoreWorkspaceRequest $request): JsonResponse
    {
        $workspace = $this->workspaceService->create(
            $request->validated(),
            $request->user()->id
        );

        return response()->json([
            'message'   => 'تم إنشاء مساحة العمل بنجاح',
            'workspace' => new WorkspaceResource($workspace),
        ], 201);
    }

    // PUT /api/workspaces/{workspace}
    public function update(UpdateWorkspaceRequest $request, Workspace $workspace): JsonResponse
    {
        $this->authorize('update', $workspace);

        $workspace = $this->workspaceService->update($workspace, $request->validated());

        return response()->json([
            'message'   => 'تم تحديث مساحة العمل بنجاح',
            'workspace' => new WorkspaceResource($workspace),
        ]);
    }

    // DELETE /api/workspaces/{workspace}
    public function destroy(Workspace $workspace): JsonResponse
    {
        $this->authorize('delete', $workspace);

        $this->workspaceService->delete($workspace);

        return response()->json([
            'message' => 'تم حذف مساحة العمل بنجاح',
        ]);
    }
}
