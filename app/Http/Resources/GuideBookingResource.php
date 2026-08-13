<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GuideBookingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'           => $this->id,
            'booking_date' => $this->booking_date?->format('Y-m-d'),
            'start_time'   => $this->start_time,
            'end_time'     => $this->end_time,
            'status'       => $this->status,
            'workspace_id' => $this->workspace_id,

            'guide' => $this->whenLoaded('guide', fn() => [
                'id'             => $this->guide->id,
                'name'           => $this->guide->user?->name,
                'city'           => $this->guide->city?->name_en,
                'specializations'=> $this->guide->specializations,
                'main_image'     => $this->guide->images
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