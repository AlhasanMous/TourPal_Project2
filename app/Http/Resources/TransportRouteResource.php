<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TransportRouteResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'               => $this->id,
            'transport_type'   => $this->transport_type,
            'duration_minutes' => $this->duration_minutes,
            'price_approx'     => $this->price_approx,
            'schedule_notes'   => $this->schedule_notes,
            'is_active'        => $this->is_active,
            'company'          => new TransportCompanyResource($this->whenLoaded('company')),
            'origin_city'      => new CityResource($this->whenLoaded('originCity')),
            'destination_city' => new CityResource($this->whenLoaded('destinationCity')),
            'created_at'       => $this->created_at,
        ];
    }
}