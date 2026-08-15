<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TransportCompanyResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'         => $this->id,
            'name_ar'    => $this->name_ar,
            'name_en'    => $this->name_en,
            'phone'      => $this->phone,
            'is_active'  => $this->is_active,
            'routes_count' => $this->whenCounted('routes'),
            'created_at' => $this->created_at,
        ];
    }
}