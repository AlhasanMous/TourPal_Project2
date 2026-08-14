<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminGuideResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                  => $this->id,
            'verification_status' => $this->verification_status,
            'specializations'     => $this->specializations,
            'availability'        => $this->availability,
            'verified_at'         => $this->verified_at,
            'rejection_reason'    => $this->rejection_reason,
            'created_at'          => $this->created_at,

            'user' => $this->whenLoaded('user', fn() => [
                'id'    => $this->user->id,
                'name'  => $this->user->name,
                'email' => $this->user->email,
                'photo' => $this->user->profile_photo,
                'bio'   => $this->user->bio,
                'languages' => $this->user->languages,
            ]),

            'city' => $this->whenLoaded('city', fn() => [
                'id'      => $this->city->id,
                'name_ar' => $this->city->name_ar,
                'name_en' => $this->city->name_en,
            ]),

            'main_image' => $this->whenLoaded('images', fn() =>
                $this->images->where('is_main', true)->first()?->image_url
            ),

            'bookings_count'  => $this->whenCounted('bookings'),
            'reviews_count'   => $this->whenCounted('reviews'),
        ];
    }
}