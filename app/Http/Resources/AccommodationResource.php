<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AccommodationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
     return [
            'id'                  => $this->id,
            'name'                => $this->name,
            'type'                => $this->type,
            'main_image' => $this->whenLoaded('images', fn() =>
             $this->images->where('is_main', true)->first()?->image_url
            ),
            'capacity'            => $this->capacity,
            'price_range'         => $this->price_range,
            'verification_status' => $this->verification_status,
            'city'                => new CityResource($this->whenLoaded('city')),
            'host'                => new UserResource($this->whenLoaded('host')),
            'created_at'          => $this->created_at,
        ];
    }
}
