<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GuideResource extends JsonResource
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
            'user'                => new UserResource($this->whenLoaded('user')),
            'city'                => new CityResource($this->whenLoaded('city')),
            'verification_status' => $this->verification_status,
            'specializations'     => $this->specializations,
            'availability'        => $this->availability,
            'verified_at'         => $this->verified_at,
          // الصح ✅
            'main_image' => $this->whenLoaded('images', 
            fn() => $this->images->where('is_main', true)->first()?->image_url
             ),

        ];
    }
}
