<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PlaceResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
       return [
            'id'                   => $this->id,
            'name_ar'              => $this->name_ar,
            'name_en'              => $this->name_en,
            'description_ar'       => $this->description_ar,
            'description_en'       => $this->description_en,
            'category'             => $this->category,
           'main_image' => $this->images->where('is_main', true)->first()?->image_url,
            'images'     => $this->whenLoaded('images', fn() => $this->images->pluck('image_url')),
            'avg_rating'           => $this->avg_rating,
            'visit_duration_hours' => $this->visit_duration_hours,
            'opening_hours'        => $this->opening_hours,
            'city'                 => new CityResource($this->whenLoaded('city')),
            'created_at'           => $this->created_at,
        ];
    }
}
