<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\NotificationResource;
use App\Models\Notification;
use App\Services\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function __construct(
        private NotificationService $notificationService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $notifications = $this->notificationService->getUserNotifications(
            $request->user()->id,
            $request->only(['unread'])
        );

        return response()->json([
            'notifications' => NotificationResource::collection($notifications),
            'unread_count'  => $this->notificationService->getUnreadCount(
                $request->user()->id
            ),
            'meta' => [
                'current_page' => $notifications->currentPage(),
                'last_page'    => $notifications->lastPage(),
                'per_page'     => $notifications->perPage(),
                'total'        => $notifications->total(),
            ],
        ]);
    }

    public function markAsRead(
        Request $request,
        Notification $notification
    ): JsonResponse {
        try {
            $notification = $this->notificationService->markAsRead(
                $notification,
                $request->user()->id
            );

            return response()->json([
                'message'      => 'تم تعيين الإشعار كمقروء',
                'notification' => new NotificationResource($notification),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 403);
        }
    }

    public function markAllAsRead(Request $request): JsonResponse
    {
        $count = $this->notificationService->markAllAsRead(
            $request->user()->id
        );

        return response()->json([
            'message' => "تم تعيين {$count} إشعار كمقروء",
        ]);
    }

    public function destroy(
        Request $request,
        Notification $notification
    ): JsonResponse {
        try {
            $this->notificationService->delete(
                $notification,
                $request->user()->id
            );

            return response()->json([
                'message' => 'تم حذف الإشعار بنجاح',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 403);
        }
    }
}