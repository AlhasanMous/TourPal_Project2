<?php

namespace App\Services;

use App\Models\Workspace;
use Illuminate\Support\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
class WorkspaceService
{
    // كل الـ Workspaces تبع المستخدم (مالك + مشارك)
    public function getUserWorkspaces(int $userId): Collection
    {
       return Workspace::with(['owner', 'participants'])
        ->where(function ($q) use ($userId) {        
            $q->where('owner_user_id', $userId)
              ->orWhereHas('participants', function ($q) use ($userId) {
                  $q->where('user_id', $userId)
                    ->where('status', 'accepted');
              });
        })
        ->latest()
        ->get();
    }
    // في app/Services/WorkspaceService.php
    public function getPublicWorkspaces(array $filters = []): LengthAwarePaginator
    {
             $query = Workspace::with(['owner'])
                      ->withCount('participants')
                      ->where('is_public', true);
                    //   ->whereNull('deleted_at');

            // بحث باسم الـ Workspace
         if (!empty($filters['search'])) {
        $query->where('name', 'like', '%' . $filters['search'] . '%');
            }

            // فلترة بتاريخ الرحلة
         if (!empty($filters['start_date'])) {
             $query->where('trip_start_date', '>=', $filters['start_date']);
         }

    return $query->latest()->paginate(15);
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