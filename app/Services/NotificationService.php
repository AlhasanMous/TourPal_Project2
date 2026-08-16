<?php

namespace App\Services;

use App\Models\Notification;
use Illuminate\Pagination\LengthAwarePaginator;

class NotificationService
{
    public function getUserNotifications(int $userId, array $filters = []): LengthAwarePaginator
    {
        $query = Notification::where('user_id', $userId)->latest();

        // فلترة غير المقروءة فقط
        if (!empty($filters['unread'])) {
            $query->whereNull('read_at');
        }

        return $query->paginate(20);
    }

    public function getUnreadCount(int $userId): int
    {
        return Notification::where('user_id', $userId)
                           ->whereNull('read_at')
                           ->count();
    }

    public function markAsRead(Notification $notification, int $userId): Notification
    {
        if ($notification->user_id !== $userId) {
            throw new \Exception('غير مصرح');
        }

        $notification->update(['read_at' => now()]);

        return $notification->fresh();
    }

    public function markAllAsRead(int $userId): int
    {
        return Notification::where('user_id', $userId)
                           ->whereNull('read_at')
                           ->update(['read_at' => now()]);
    }

    public function delete(Notification $notification, int $userId): void
    {
        if ($notification->user_id !== $userId) {
            throw new \Exception('غير مصرح');
        }

        $notification->delete();
    }
}