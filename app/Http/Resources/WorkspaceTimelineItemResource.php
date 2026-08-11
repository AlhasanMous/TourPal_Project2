<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WorkspaceTimelineItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'           => $this->id,
            'planned_date' => $this->planned_date?->format('Y-m-d'),
            'planned_time' => $this->planned_time,
            'order_in_day' => $this->order_in_day,
            'item_type'    => $this->item_type,
            'reference_id' => $this->reference_id,
            'label'        => $this->label,
            'notes'        => $this->notes,

            // المشاركين في هاد النشاط
            'participants' => $this->whenLoaded(
                'participants',
                fn() => $this->participants->map(fn($p) => [
                    'id'   => $p->user->id,
                    'name' => $p->user->name,
                ])
            ),

            'added_by'     => $this->whenLoaded(
                'addedBy',
                fn() => [
                    'id'   => $this->addedBy->id,
                    'name' => $this->addedBy->name,
                ]
            ),

            'created_at'   => $this->created_at,
        ];
    }
}