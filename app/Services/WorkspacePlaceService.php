<?php

namespace App\Services;

use App\Models\Workspace;
use App\Models\WorkspacePlace;
use Illuminate\Support\Facades\DB;

class WorkspacePlaceService
{
    // إضافة مكان للـ Pool
    public function addPlace(Workspace $workspace, int $placeId, int $addedBy): WorkspacePlace
    {
        // تحقق إن المكان مو موجود مسبقاً
        $exists = WorkspacePlace::where('workspace_id', $workspace->id)
            ->where('place_id', $placeId)
            ->exists();

        if ($exists) {
            throw new \Exception('هذا المكان موجود مسبقاً في الرحلة');
        }

        return WorkspacePlace::create([
            'workspace_id' => $workspace->id,
            'place_id'     => $placeId,
            'added_by'     => $addedBy,
        ]);
    }

    // حذف مكان من الـ Pool
    public function removePlace(Workspace $workspace, int $placeId): void
    {
        $workspacePlace = WorkspacePlace::where('workspace_id', $workspace->id)
            ->where('place_id', $placeId)
            ->firstOrFail();

        $workspacePlace->delete();
    }

    // جلب كل الأماكن في الـ Pool
    public function getPlaces(Workspace $workspace)
    {
        return $workspace->places()
            ->with(['place.city', 'place.images'])
            ->get();
    }
}