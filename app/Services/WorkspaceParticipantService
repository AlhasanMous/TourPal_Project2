<?php

namespace App\Services;

use App\Models\Workspace;
use App\Models\User;
use App\Models\Notification;
use Illuminate\Support\Facades\DB;

class WorkspaceParticipantService
{
    // دعوة مستخدم للـ Workspace
    public function invite(Workspace $workspace, int $ownerId, string $email): void
    {
        $invitee = User::where('email', $email)->firstOrFail();

        // ما يدعو نفسه
        if ($invitee->id === $ownerId) {
            throw new \Exception('لا يمكنك دعوة نفسك');
        }

        // ما يدعو شخص موجود مسبقاً
        $exists = $workspace->participants()
            ->where('user_id', $invitee->id)
            ->exists();

        if ($exists) {
            throw new \Exception('هذا المستخدم مدعو مسبقاً');
        }

        DB::transaction(function () use ($workspace, $invitee, $ownerId) {
            // أضف المشارك بحالة pending
            $workspace->participants()->attach($invitee->id, [
                'status'     => 'pending',
                'invited_at' => now(),
            ]);

            // أرسل إشعار للمدعو
            Notification::create([
                'user_id' => $invitee->id,
                'type'    => 'workspace_invite',
                'data'    => [
                    'workspace_id'   => $workspace->id,
                    'workspace_name' => $workspace->name,
                    'inviter_id'     => $ownerId,
                ],
            ]);
        });
    }

    // قبول الدعوة
    public function accept(Workspace $workspace, int $userId): void
    {
        $participant = $workspace->participants()
            ->where('user_id', $userId)
            ->wherePivot('status', 'pending')
            ->firstOrFail();

        $workspace->participants()->updateExistingPivot($userId, [
            'status'    => 'accepted',
            'joined_at' => now(),
        ]);
    }

    // رفض الدعوة
    public function decline(Workspace $workspace, int $userId): void
    {
        $workspace->participants()
            ->where('user_id', $userId)
            ->wherePivot('status', 'pending')
            ->firstOrFail();

        $workspace->participants()->updateExistingPivot($userId, [
            'status' => 'declined',
        ]);
    }

    // إزالة مشارك (بواسطة المالك)
    public function remove(Workspace $workspace, int $userId): void
    {
        $workspace->participants()->detach($userId);
    }
}