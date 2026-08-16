<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AccommodationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                  => $this->id,
            'name'                => $this->name,
            'type'                => $this->type,
            'main_image'          => $this->whenLoaded('images', function () {
                $image = $this->images->where('is_main', true)->first();
                return $image ? $this->imageUrl($image->image_url) : null;
            }),
            'images'              => $this->whenLoaded('images', fn() =>
                $this->images->map(fn($img) => [
                    'url'        => $this->imageUrl($img->image_url),
                    'is_main'    => $img->is_main,
                    'sort_order' => $img->sort_order,
                ])
            ),
            'capacity'            => $this->capacity,
            'price_range'         => $this->price_range,
            'verification_status' => $this->verification_status,
            'city'                => new CityResource($this->whenLoaded('city')),
            'host'                => new UserResource($this->whenLoaded('host')),
            'created_at'          => $this->created_at,
        ];
    }

    // ← نفس الـ helper تبع PlaceResource
    private function imageUrl(?string $url): ?string
    {
        if (!$url) return null;
        if (str_starts_with($url, 'http')) return $url;
        return asset($url);
    }
}