<?php

namespace App\Services\Admin;

use App\Models\Workspace;
use Illuminate\Pagination\LengthAwarePaginator;

class AdminWorkspaceService
{
    public function getAll(array $filters = []): LengthAwarePaginator
    {
        $query = Workspace::with(['owner', 'participants'])
                          ->withCount('participants');

        // بحث باسم الـ Workspace
        if (!empty($filters['search'])) {
            $query->where('name', 'like', '%' . $filters['search'] . '%');
        }

        // فلترة حسب is_public
        if (isset($filters['is_public'])) {
            $query->where('is_public', $filters['is_public']);
        }

        return $query->latest()->paginate(20);
    }

    public function findById(int $id): Workspace
    {
        return Workspace::with(['owner', 'participants'])
                        ->withTrashed() // الادمن يشوف المحذوفة كمان
                        ->findOrFail($id);
    }

    public function delete(Workspace $workspace): void
    {
        $workspace->delete();
    }
}