<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReviewResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'              => $this->id,
            'rating'          => $this->rating,
            'content'         => $this->content,
            'reviewable_type' => $this->reviewable_type,
            'reviewable_id'   => $this->reviewable_id,
            'reviewer'        => $this->whenLoaded('reviewer', fn() => [
                'id'    => $this->reviewer->id,
                'name'  => $this->reviewer->name,
                'photo' => $this->reviewer->profile_photo,
            ]),
            'created_at'      => $this->created_at,
        ];
    }
}