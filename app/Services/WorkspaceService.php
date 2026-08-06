<?php

namespace App\Services;

use App\Models\Workspace;
use Illuminate\Support\Collection;

class WorkspaceService
{
    // كل الـ Workspaces تبع المستخدم (مالك + مشارك)
    public function getUserWorkspaces(int $userId): Collection
    {
        return Workspace::with(['owner', 'participants'])
            ->where('owner_user_id', $userId)
            ->orWhereHas('participants', function ($q) use ($userId) {
                $q->where('user_id', $userId)
                  ->where('status', 'accepted');
            })
            ->latest()
            ->get();
    }

    public function create(array $data, int $ownerId): Workspace
    {
        return Workspace::create([
            ...$data,
            'owner_user_id' => $ownerId,
        ]);
    }

    public function update(Workspace $workspace, array $data): Workspace
    {
        $workspace->update($data);
        return $workspace->fresh(['owner', 'participants']);
    }

    public function delete(Workspace $workspace): void
    {
        $workspace->delete();
    }
}