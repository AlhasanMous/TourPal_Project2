<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WorkspaceSuggestionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'               => $this->id,
            'workspace_id'     => $this->workspace_id,
            'type'             => $this->type,
            'payload'          => $this->payload,
            'note'             => $this->note,
            'status'           => $this->status,
            'rejection_reason' => $this->rejection_reason,
            'responded_at'     => $this->responded_at,
            'suggester'        => $this->whenLoaded('suggester', fn() => [
                'id'    => $this->suggester->id,
                'name'  => $this->suggester->name,
                'photo' => $this->suggester->profile_photo,
            ]),
            'created_at'       => $this->created_at,
        ];
    }
}