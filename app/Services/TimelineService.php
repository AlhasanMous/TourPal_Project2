<?php

namespace App\Services;

use App\Models\Place;
use App\Models\AccommodationBooking;
use App\Models\TransportRoute;
use App\Models\Workspace;
use App\Models\WorkspaceTimelineItem;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class TimelineService
{
    // ─────────────────────────────────────────
    // الجداول المرتبطة بكل item_type
    // ─────────────────────────────────────────
    private array $typeModels = [
        'place'         => Place::class,
        'accommodation' => AccommodationBooking::class,
        'transport'     => TransportRoute::class,
    ];

    // ─────────────────────────────────────────
    // إضافة item للـ Timeline
    // ─────────────────────────────────────────
    public function addItem(Workspace $workspace, array $data): WorkspaceTimelineItem
    {
        // تحقق من الـ reference_id في قاعدة البيانات
        if ($data['item_type'] !== 'note') {
            $this->validateReference($data['item_type'], $data['reference_id']);
        }

        // إذا ما حدد order_in_day — احسبه تلقائياً
        if (empty($data['order_in_day'])) {
            $data['order_in_day'] = $this->getNextOrder(
                $workspace->id,
                $data['planned_date']
            );
        }

        return DB::transaction(function () use ($workspace, $data) {
            return WorkspaceTimelineItem::create([
                'workspace_id'  => $workspace->id,
                'planned_date'  => $data['planned_date'],
                'planned_time'  => $data['planned_time'] ?? null,
                'order_in_day'  => $data['order_in_day'],
                'item_type'     => $data['item_type'],
                'reference_id'  => $data['reference_id'] ?? null,
                'label'         => $data['label'] ?? null,
                'notes'         => $data['notes'] ?? null,
                'added_by' => $workspace->owner_user_id,
            ]);
        });
    }

    // ─────────────────────────────────────────
    // تعديل item
    // ─────────────────────────────────────────
    public function updateItem(WorkspaceTimelineItem $item, array $data): WorkspaceTimelineItem
    {
        $item->update(array_filter($data, fn($v) => !is_null($v)));
        return $item->fresh();
    }

    // ─────────────────────────────────────────
    // حذف item
    // ─────────────────────────────────────────
    public function deleteItem(WorkspaceTimelineItem $item): void
    {
        DB::transaction(function () use ($item) {
            // cascade بيحذف الـ participants تلقائياً (ON DELETE CASCADE في الـ Migration)
            $item->delete();
        });
    }

    // ─────────────────────────────────────────
    // عرض الـ Timeline مجمع بالأيام
    // ─────────────────────────────────────────
    public function getTimeline(Workspace $workspace): array
    {
        $items = WorkspaceTimelineItem::with(['participants.user'])
            ->where('workspace_id', $workspace->id)
            ->orderBy('planned_date')
            ->orderBy('order_in_day')
            ->orderBy('planned_time')
            ->get();

        // جمّع الـ items بالأيام
        return $items
            ->groupBy(fn($item) => $item->planned_date->format('Y-m-d'))
            ->map(fn($dayItems, $date) => [
                'date'  => $date,
                'items' => $dayItems->values(),
            ])
            ->values()
            ->toArray();
    }

    // ─────────────────────────────────────────
    // إضافة مشارك لـ activity
    // ─────────────────────────────────────────
    public function addParticipant(WorkspaceTimelineItem $item, int $userId): void
    {
        // تحقق إنه مشارك مقبول في الـ Workspace
        $isParticipant = $item->workspace->participants()
            ->where('user_id', $userId)
            ->where('status', 'accepted')
            ->exists();

        // أو إذا هو المالك
        $isOwner = $item->workspace->owner_user_id === $userId;

        if (!$isParticipant && !$isOwner) {
            throw ValidationException::withMessages([
                'user_id' => ['المستخدم ليس عضواً في هذه الرحلة'],
            ]);
        }

        // منع التكرار
        $alreadyAdded = $item->participants()
            ->where('user_id', $userId)
            ->exists();

        if ($alreadyAdded) {
            throw ValidationException::withMessages([
                'user_id' => ['المستخدم مضاف مسبقاً لهذا النشاط'],
            ]);
        }

        $item->participants()->create(['user_id' => $userId]);
    }

    // ─────────────────────────────────────────
    // إزالة مشارك من activity
    // ─────────────────────────────────────────
    public function removeParticipant(WorkspaceTimelineItem $item, int $userId): void
    {
        $deleted = $item->participants()
            ->where('user_id', $userId)
            ->delete();

        if (!$deleted) {
            throw ValidationException::withMessages([
                'user_id' => ['المستخدم غير موجود في هذا النشاط'],
            ]);
        }
    }

    // ─────────────────────────────────────────
    // Helpers
    // ─────────────────────────────────────────

    // تحقق إن الـ reference_id موجود في الجدول الصح
    private function validateReference(string $type, ?int $referenceId): void
    {
        if (!$referenceId) {
            throw ValidationException::withMessages([
                'reference_id' => ['معرّف العنصر مطلوب لهذا النوع من النشاط'],
            ]);
        }

        $model = $this->typeModels[$type] ?? null;

        if (!$model || !$model::find($referenceId)) {
            throw ValidationException::withMessages([
                'reference_id' => ["العنصر المحدد غير موجود في النظام"],
            ]);
        }
    }

    // احسب الـ order التالي لليوم
    private function getNextOrder(int $workspaceId, string $date): int
    {
        $max = WorkspaceTimelineItem::where('workspace_id', $workspaceId)
            ->where('planned_date', $date)
            ->max('order_in_day');

        return ($max ?? -1) + 1;
    }
}