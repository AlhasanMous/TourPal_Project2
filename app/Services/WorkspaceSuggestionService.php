<?php

namespace App\Services;

use App\Models\Notification;
use App\Models\Workspace;
use App\Models\WorkspaceSuggestion;
use App\Models\WorkspaceTimelineItem;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class WorkspaceSuggestionService
{
    public function __construct(private TimelineService $timelineService) {}

    // ─── إنشاء اقتراح جديد ───────────────────────────────
    public function create(Workspace $workspace, array $data, int $suggesterId): WorkspaceSuggestion
    {
        // تحقق إن المقترح مشارك مقبول أو مالك
        $isParticipant = $workspace->participants()
            ->where('user_id', $suggesterId)
            ->where('status', 'accepted')
            ->exists();

        $isOwner = $workspace->owner_user_id === $suggesterId;

        if (!$isParticipant && !$isOwner) {
            throw ValidationException::withMessages([
                'workspace' => ['يجب أن تكون عضواً مقبولاً في الرحلة لتقديم اقتراح'],
            ]);
        }

        return DB::transaction(function () use ($workspace, $data, $suggesterId) {
            $suggestion = WorkspaceSuggestion::create([
                'workspace_id'      => $workspace->id,
                'suggester_user_id' => $suggesterId,
                'type'              => $data['type'],
                'payload'           => $data['payload'],
                'note'              => $data['note'] ?? null,
                'status'            => 'pending',
            ]);

            // إشعار للمالك
            Notification::create([
                'user_id' => $workspace->owner_user_id,
                'type'    => 'suggestion_new',
                'data'    => [
                    'suggestion_id' => $suggestion->id,
                    'workspace_id'  => $workspace->id,
                    'workspace_name'=> $workspace->name,
                    'type'          => $data['type'],
                    'suggester_id'  => $suggesterId,
                ],
            ]);

            return $suggestion;
        });
    }

    // ─── رد المالك على الاقتراح ──────────────────────────
    public function respond(
        Workspace $workspace,
        WorkspaceSuggestion $suggestion,
        string $action,
        int $ownerId,
        ?string $rejectionReason = null
    ): WorkspaceSuggestion {

        // فقط المالك يقدر يرد
        if ($workspace->owner_user_id !== $ownerId) {
            throw ValidationException::withMessages([
                'workspace' => ['فقط مالك الرحلة يمكنه قبول أو رفض الاقتراحات'],
            ]);
        }

        // ما يرد على اقتراح مو pending
        if ($suggestion->status !== 'pending') {
            throw ValidationException::withMessages([
                'suggestion' => ['تم الرد على هذا الاقتراح مسبقاً'],
            ]);
        }

        return DB::transaction(function () use (
            $workspace, $suggestion, $action, $ownerId, $rejectionReason
        ) {
            if ($action === 'accept') {
                // طبّق الاقتراح على الـ Timeline
                $this->applySuggestion($workspace, $suggestion, $ownerId);

                $suggestion->update([
                    'status'       => 'accepted',
                    'responded_at' => now(),
                ]);

                // إشعار للمقترح
                Notification::create([
                    'user_id' => $suggestion->suggester_user_id,
                    'type'    => 'suggestion_accepted',
                    'data'    => [
                        'suggestion_id'  => $suggestion->id,
                        'workspace_id'   => $workspace->id,
                        'workspace_name' => $workspace->name,
                    ],
                ]);
            } else {
                $suggestion->update([
                    'status'           => 'rejected',
                    'responded_at'     => now(),
                    'rejection_reason' => $rejectionReason,
                ]);

                // إشعار للمقترح
                Notification::create([
                    'user_id' => $suggestion->suggester_user_id,
                    'type'    => 'suggestion_rejected',
                    'data'    => [
                        'suggestion_id'    => $suggestion->id,
                        'workspace_id'     => $workspace->id,
                        'workspace_name'   => $workspace->name,
                        'rejection_reason' => $rejectionReason,
                    ],
                ]);
            }

            return $suggestion->fresh(['suggester']);
        });
    }

    // ─── تطبيق الاقتراح على الـ Timeline ─────────────────
    private function applySuggestion(
        Workspace $workspace,
        WorkspaceSuggestion $suggestion,
        int $ownerId
    ): void {
        $payload = $suggestion->payload;

        match ($suggestion->type) {

            'add_place' => $this->timelineService->addItem($workspace, [
                'item_type'    => 'place',
                'reference_id' => $payload['place_id'],
                'planned_date' => $payload['planned_date'],
                'planned_time' => $payload['planned_time'] ?? null,
                'order_in_day' => $payload['order_in_day'] ?? null,
                'label'        => null,
                'notes'        => null,
            ], $ownerId),

            'remove_place', 'remove_note' => WorkspaceTimelineItem::findOrFail(
                $payload['timeline_item_id']
            )->delete(),

            'reorder' => WorkspaceTimelineItem::findOrFail($payload['timeline_item_id'])
                ->update([
                    'planned_date' => $payload['planned_date'],
                    'planned_time' => $payload['planned_time'] ?? null,
                    'order_in_day' => $payload['order_in_day'],
                ]),

            'change_hours' => WorkspaceTimelineItem::findOrFail($payload['timeline_item_id'])
                ->update(['planned_time' => $payload['planned_time']]),

            'add_note' => $this->timelineService->addItem($workspace, [
                'item_type'    => 'note',
                'reference_id' => null,
                'planned_date' => $payload['planned_date'],
                'planned_time' => $payload['planned_time'] ?? null,
                'order_in_day' => $payload['order_in_day'] ?? null,
                'label'        => $payload['label'],
                'notes'        => null,
            ], $ownerId),

            default => null,
        };
    }
}