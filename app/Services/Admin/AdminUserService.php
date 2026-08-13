<?php

namespace App\Services\Admin;

use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;

class AdminUserService
{
    public function getAll(array $filters = []): LengthAwarePaginator
    {
        $query = User::with(['guide'])
                     ->withCount('accommodations')
                     ->withTrashed(); // الادمن يشوف المحذوفين كمان

        // بحث
        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('name', 'like', '%' . $filters['search'] . '%')
                  ->orWhere('email', 'like', '%' . $filters['search'] . '%');
            });
        }

        // فلترة حسب الدور
        // بعد ✅ — حدد الـ guard
        if (!empty($filters['role'])) {
        $query->role($filters['role'], 'api');
        }

        // فلترة المحذوفين
        if (isset($filters['deleted']) && $filters['deleted'] === 'true') {
            $query->onlyTrashed();
        }

        return $query->latest()->paginate(20);
    }

    public function findById(int $id): User
    {
        return User::with(['guide.city'])
                   ->withCount('accommodations')
                   ->withTrashed()
                   ->findOrFail($id);
    }

    public function update(User $user, array $data): User
    {
        $user->update($data);
        return $user->fresh(['guide']);
    }

    public function delete(User $user): void
    {
        // ما نحذف الادمن
        if ($user->hasRole('admin')) {
            throw new \Exception('لا يمكن حذف حساب الادمن');
        }
        $user->delete(); // Soft Delete
    }

    public function restore(User $user): void
    {
        $user->restore();
    }
public function toggleVerification(User $user): User
{
    $user->email_verified_at = $user->email_verified_at ? null : now();
    $user->save();

    return $user->fresh();
}
}