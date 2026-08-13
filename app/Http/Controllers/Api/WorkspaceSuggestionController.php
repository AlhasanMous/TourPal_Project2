<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Workspace\RespondSuggestionRequest;
use App\Http\Requests\Workspace\StoreSuggestionRequest;
use App\Http\Resources\WorkspaceSuggestionResource;
use App\Models\Workspace;
use App\Models\WorkspaceSuggestion;
use App\Services\WorkspaceSuggestionService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\JsonResponse;

class WorkspaceSuggestionController extends Controller
{
    use AuthorizesRequests;

    public function __construct(
        private WorkspaceSuggestionService $suggestionService
    ) {}

    // GET /workspaces/{workspace}/suggestions
    public function index(Workspace $workspace): JsonResponse
    {
        $this->authorize('view', $workspace);

        $suggestions = WorkspaceSuggestion::with('suggester')
            ->where('workspace_id', $workspace->id)
            ->latest()
            ->get();

        return response()->json([
            'suggestions' => WorkspaceSuggestionResource::collection($suggestions),
        ]);
    }

    // GET /workspaces/{workspace}/suggestions/pending
    public function pending(Workspace $workspace): JsonResponse
    {
        $this->authorize('update', $workspace);

        $suggestions = WorkspaceSuggestion::with('suggester')
            ->where('workspace_id', $workspace->id)
            ->where('status', 'pending')
            ->latest()
            ->get();

        return response()->json([
            'pending_count' => $suggestions->count(),
            'suggestions'   => WorkspaceSuggestionResource::collection($suggestions),
        ]);
    }

    // POST /workspaces/{workspace}/suggestions
    public function store(
        StoreSuggestionRequest $request,
        Workspace $workspace
    ): JsonResponse {
        $this->authorize('view', $workspace);

        try {
            $suggestion = $this->suggestionService->create(
                $workspace,
                $request->validated(),
                $request->user()->id
            );

            return response()->json([
                'message'    => 'تم إرسال الاقتراح بنجاح',
                'suggestion' => new WorkspaceSuggestionResource(
                    $suggestion->load('suggester')
                ),
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    // POST /workspaces/{workspace}/suggestions/{suggestion}/respond
    public function respond(
        RespondSuggestionRequest $request,
        Workspace $workspace,
        WorkspaceSuggestion $suggestion
    ): JsonResponse {
        try {
            $suggestion = $this->suggestionService->respond(
                $workspace,
                $suggestion,
                $request->action,
                $request->user()->id,
                $request->rejection_reason
            );

            $message = $request->action === 'accept'
                ? 'تم قبول الاقتراح وتطبيقه على الجدول الزمني'
                : 'تم رفض الاقتراح';

            return response()->json([
                'message'    => $message,
                'suggestion' => new WorkspaceSuggestionResource($suggestion),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 422);
        }
    }
}