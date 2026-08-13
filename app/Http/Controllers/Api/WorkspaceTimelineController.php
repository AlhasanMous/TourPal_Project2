<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Workspace\StoreTimelineItemRequest;
use App\Http\Requests\Workspace\UpdateTimelineItemRequest;
use App\Http\Resources\WorkspaceTimelineItemResource;
use App\Models\Workspace;
use App\Models\WorkspaceTimelineItem;
use App\Services\TimelineService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class WorkspaceTimelineController extends Controller
{
    use AuthorizesRequests;
    
    public function __construct(private TimelineService $timelineService) {}

    // ─────────────────────────────────────────
    // GET /workspaces/{workspace}/timeline
    // ─────────────────────────────────────────
    public function index(Workspace $workspace): JsonResponse
    {
        $this->authorize('view', $workspace);

        $timeline = $this->timelineService->getTimeline($workspace);

        return response()->json([
            'workspace_id' => $workspace->id,
            'timeline'     => $timeline,
        ]);
    }

    // ─────────────────────────────────────────
    // POST /workspaces/{workspace}/timeline
    // ─────────────────────────────────────────
    public function store(
        StoreTimelineItemRequest $request,
        Workspace $workspace
    ): JsonResponse {
        $this->authorize('update', $workspace);

        $item = $this->timelineService->addItem($workspace, $request->validated());

        return response()->json([
            'message' => 'تمت إضافة النشاط للجدول الزمني',
            'item'    => new WorkspaceTimelineItemResource($item),
        ], 201);
    }

    // ─────────────────────────────────────────
    // PUT /workspaces/{workspace}/timeline/{item}
    // ─────────────────────────────────────────
    public function update(
        UpdateTimelineItemRequest $request,
        Workspace $workspace,
        WorkspaceTimelineItem $item
    ): JsonResponse {
        $this->authorize('update', $workspace);

        // تأكد إن الـ item ينتمي لهاد الـ Workspace
        if ($item->workspace_id !== $workspace->id) {
            return response()->json([
                'message' => 'هذا النشاط لا ينتمي لهذه الرحلة',
            ], 403);
        }

        $item = $this->timelineService->updateItem($item, $request->validated());

        return response()->json([
            'message' => 'تم تعديل النشاط بنجاح',
            'item'    => new WorkspaceTimelineItemResource($item),
        ]);
    }

    // ─────────────────────────────────────────
    // DELETE /workspaces/{workspace}/timeline/{item}
    // ─────────────────────────────────────────
    public function destroy(
        Workspace $workspace,
        WorkspaceTimelineItem $item
    ): JsonResponse {
        $this->authorize('update', $workspace);

        if ($item->workspace_id !== $workspace->id) {
            return response()->json([
                'message' => 'هذا النشاط لا ينتمي لهذه الرحلة',
            ], 403);
        }

        $this->timelineService->deleteItem($item);

        return response()->json([
            'message' => 'تم حذف النشاط بنجاح',
        ]);
    }

    // ─────────────────────────────────────────
    // POST /workspaces/{workspace}/timeline/{item}/participants
    // ─────────────────────────────────────────
    public function addParticipant(
        Request $request,
        Workspace $workspace,
        WorkspaceTimelineItem $item
    ): JsonResponse {
        $this->authorize('view', $workspace);

        $request->validate([
            'user_id' => ['required', 'integer', 'exists:users,id'],
        ], [
            'user_id.required' => 'معرّف المستخدم مطلوب',
            'user_id.exists'   => 'المستخدم غير موجود',
        ]);

        if ($item->workspace_id !== $workspace->id) {
            return response()->json([
                'message' => 'هذا النشاط لا ينتمي لهذه الرحلة',
            ], 403);
        }

        $this->timelineService->addParticipant($item, $request->integer('user_id'));
        return response()->json([
            'message' => 'تمت إضافة المشارك للنشاط',
        ]);
    }

    // ─────────────────────────────────────────
    // DELETE /workspaces/{workspace}/timeline/{item}/participants/{userId}
    // ─────────────────────────────────────────
    public function removeParticipant(
        Workspace $workspace,
        WorkspaceTimelineItem $item,
        int $userId
    ): JsonResponse {
        $this->authorize('view', $workspace);

        if ($item->workspace_id !== $workspace->id) {
            return response()->json([
                'message' => 'هذا النشاط لا ينتمي لهذه الرحلة',
            ], 403);
        }

        $this->timelineService->removeParticipant($item, $userId);

        return response()->json([
            'message' => 'تمت إزالة المشارك من النشاط',
        ]);
    }
}