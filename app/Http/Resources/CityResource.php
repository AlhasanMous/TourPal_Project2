<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CityResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'        => $this->id,
            'name_ar'   => $this->name_ar,
            'name_en'   => $this->name_en,
            'region'    => $this->region,
            'places_count' => $this->whenCounted('places'), // ← عدد الأماكن
            'created_at'   => $this->created_at,
        ];
    }
}
