<?php

namespace App\Services;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;

class NotificationService
{
    public function getUserNotifications(
        int $userId,
        array $filters = []
    ): LengthAwarePaginator {
        $query = Notification::where('user_id', $userId)->latest();

        if (!empty($filters['unread'])) {
            $query->whereNull('read_at');
        }

        $notifications = $query->paginate(20);

        $this->attachInviters($notifications);

        return $notifications;
    }

    public function getUnreadCount(int $userId): int
    {
        return Notification::where('user_id', $userId)
            ->whereNull('read_at')
            ->count();
    }

    public function markAsRead(
        Notification $notification,
        int $userId
    ): Notification {
        if ($notification->user_id !== $userId) {
            throw new \Exception('غير مصرح');
        }

        $notification->update([
            'read_at' => now(),
        ]);

        $notification = $notification->fresh();

        $this->attachInviterToNotification($notification);

        return $notification;
    }

    public function markAllAsRead(int $userId): int
    {
        return Notification::where('user_id', $userId)
            ->whereNull('read_at')
            ->update([
                'read_at' => now(),
            ]);
    }

    public function delete(
        Notification $notification,
        int $userId
    ): void {
        if ($notification->user_id !== $userId) {
            throw new \Exception('غير مصرح');
        }

        $notification->delete();
    }

    private function attachInviters(
        LengthAwarePaginator $notifications
    ): void {
        $inviterIds = $notifications->getCollection()
            ->filter(
                fn (Notification $notification) =>
                    $notification->type === 'workspace_invite'
            )
            ->pluck('data.inviter_id')
            ->filter()
            ->unique()
            ->values();

        if ($inviterIds->isEmpty()) {
            return;
        }

        $inviters = User::whereIn('id', $inviterIds)
            ->get()
            ->keyBy('id');

        $notifications->getCollection()->each(
            function (Notification $notification) use ($inviters) {

                if ($notification->type !== 'workspace_invite') {
                    return;
                }

                $inviterId = $notification->data['inviter_id'] ?? null;

                if ($inviterId) {
                    $notification->setRelation(
                        'inviter',
                        $inviters->get($inviterId)
                    );
                }
            }
        );
    }

    private function attachInviterToNotification(
        Notification $notification
    ): void {
        if ($notification->type !== 'workspace_invite') {
            return;
        }

        $inviterId = $notification->data['inviter_id'] ?? null;

        if (!$inviterId) {
            return;
        }

        $inviter = User::find($inviterId);

        $notification->setRelation('inviter', $inviter);
    }
}