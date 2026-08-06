<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WorkspaceResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
         return [
            'id'              => $this->id,
            'name'            => $this->name,
            'description'     => $this->description,
            'owner'           => new UserResource($this->whenLoaded('owner')),
            'trip_start_date' => $this->trip_start_date,
            'trip_end_date'   => $this->trip_end_date,
            'is_public'       => $this->is_public,
            'participants'    => UserResource::collection($this->whenLoaded('participants')),
            'created_at'      => $this->created_at,
        ];
    }
}
