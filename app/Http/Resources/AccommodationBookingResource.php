<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AccommodationBookingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'        => $this->id,
            'check_in'  => $this->check_in?->format('Y-m-d'),
            'check_out' => $this->check_out?->format('Y-m-d'),
            'room_type' => $this->room_type,
            'status'    => $this->status,
            'workspace_id' => $this->workspace_id,

            'accommodation' => $this->whenLoaded('accommodation', fn() => [
                'id'         => $this->accommodation->id,
                'name'       => $this->accommodation->name,
                'type'       => $this->accommodation->type,
                'capacity'   => $this->accommodation->capacity,
                'price_range'=> $this->accommodation->price_range,
                'city'       => $this->accommodation->city?->name_en,
                'main_image' => $this->accommodation->images
                    ?->where('is_main', true)
                    ->first()?->image_url,
            ]),

            'tourist' => $this->whenLoaded('tourist', fn() => [
                'id'    => $this->tourist->id,
                'name'  => $this->tourist->name,
                'email' => $this->tourist->email,
                'photo' => $this->tourist->profile_photo,
            ]),

            'created_at' => $this->created_at,
        ];
    }
}