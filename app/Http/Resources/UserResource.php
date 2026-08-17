<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                  => $this->id,
            'name'                => $this->name,
            'email'               => $this->email,
            'profile_photo_url'   => $this->profile_photo_url,
            'bio'                 => $this->bio,
            'languages'           => $this->languages,
            'is_matching_enabled' => $this->is_matching_enabled,
            'roles'               => $this->getRoleNames(),
            'email_verified_at'   => $this->email_verified_at,
            'created_at'          => $this->created_at,
        ];
    }
}