<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminUserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                  => $this->id,
            'name'                => $this->name,
            'email'               => $this->email,
            'profile_photo'       => $this->profile_photo,
            'bio'                 => $this->bio,
            'languages'           => $this->languages,
            'is_matching_enabled' => $this->is_matching_enabled,
            'roles'               => $this->getRoleNames(),
            'email_verified_at'   => $this->email_verified_at,
            'is_deleted'          => !is_null($this->deleted_at),
            'deleted_at'          => $this->deleted_at,
            'created_at'          => $this->created_at,
            'updated_at'          => $this->updated_at,

            // للـ Guide
            'guide' => $this->whenLoaded('guide', fn() => [
                'id'                  => $this->guide->id,
                'city'                => $this->guide->city?->name_en,
                'verification_status' => $this->guide->verification_status,
                'specializations'     => $this->guide->specializations,
            ]),

            // للـ Host
            'accommodations_count' => $this->whenCounted('accommodations'),
        ];
    }
}