<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Workspace\InviteParticipantRequest;
use App\Models\Workspace;
use App\Services\WorkspaceParticipantService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WorkspaceParticipantController extends Controller
{
    use AuthorizesRequests;

    public function __construct(private WorkspaceParticipantService $participantService) {}

    // POST /api/workspaces/{workspace}/invite
    public function invite(InviteParticipantRequest $request, Workspace $workspace): JsonResponse
    {
        $this->authorize('update', $workspace);

        try {
            $this->participantService->invite(
                $workspace,
                $request->user()->id,
                $request->email
            );

            return response()->json([
                'message' => 'تم إرسال الدعوة بنجاح',
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    // POST /api/workspaces/{workspace}/accept
    public function accept(Request $request, Workspace $workspace): JsonResponse
    {
        try {
            $this->participantService->accept($workspace, $request->user()->id);

            return response()->json([
                'message' => 'تم قبول الدعوة بنجاح',
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'لا توجد دعوة معلقة لك في هذا الـ Workspace',
            ], 422);
        }
    }

    // POST /api/workspaces/{workspace}/decline
    public function decline(Request $request, Workspace $workspace): JsonResponse
    {
        try {
            $this->participantService->decline($workspace, $request->user()->id);

            return response()->json([
                'message' => 'تم رفض الدعوة',
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'لا توجد دعوة معلقة لك في هذا الـ Workspace',
            ], 422);
        }
    }

    // DELETE /api/workspaces/{workspace}/participants/{user}
    public function remove(Request $request, Workspace $workspace, int $userId): JsonResponse
    {
        $this->authorize('update', $workspace);

        // المالك ما يقدر يحذف نفسه
        if ($userId === $request->user()->id) {
            return response()->json([
                'message' => 'لا يمكنك إزالة نفسك من الـ Workspace',
            ], 422);
        }

        $this->participantService->remove($workspace, $userId);

        return response()->json([
            'message' => 'تم إزالة المشارك بنجاح',
        ]);
    }
}