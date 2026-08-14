<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminAccommodationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                  => $this->id,
            'name'                => $this->name,
            'type'                => $this->type,
            'capacity'            => $this->capacity,
            'price_range'         => $this->price_range,
            'verification_status' => $this->verification_status,
            'verified_at'         => $this->verified_at,
            'rejection_reason'    => $this->rejection_reason,
            'created_at'          => $this->created_at,

            'city' => $this->whenLoaded('city', fn() => [
                'id'      => $this->city->id,
                'name_ar' => $this->city->name_ar,
                'name_en' => $this->city->name_en,
            ]),

            'host' => $this->whenLoaded('host', fn() => [
                'id'    => $this->host->id,
                'name'  => $this->host->name,
                'email' => $this->host->email,
            ]),

            'main_image'       => $this->whenLoaded('images', fn() =>
                $this->images->where('is_main', true)->first()?->image_url
            ),
            'bookings_count'   => $this->whenCounted('bookings'),
            'reviews_count'    => $this->whenCounted('reviews'),
        ];
    }
}