<?php

namespace App\Services\Admin;

use App\Models\Workspace;
use Illuminate\Pagination\LengthAwarePaginator;
use App\Models\WorkspaceSuggestion;
class AdminWorkspaceService
{
    public function getAll(array $filters = []): LengthAwarePaginator
    {
        $query = Workspace::with(['owner', 'participants'])
                          ->withCount('participants');

        // بحث باسم الـ Workspace
        if (!empty($filters['search'])) {
            $query->where('name', 'like', '%' . $filters['search'] . '%');
        }

        // فلترة حسب is_public
        if (isset($filters['is_public'])) {
            $query->where('is_public', $filters['is_public']);
        }

        return $query->latest()->paginate(20);
    }

    public function findById(int $id): Workspace
    {
        return Workspace::with(['owner', 'participants'])
                        ->withTrashed() // الادمن يشوف المحذوفة كمان
                        ->findOrFail($id);
    }
    public function getParticipants(Workspace $workspace): array
    {
        $owner = $workspace->owner;
        $participants = $workspace->participants()
            ->withPivot('status', 'invited_at', 'joined_at')
            ->get();

        return [
            'owner' => [
                'id'    => $owner->id,
                'name'  => $owner->name,
                'email' => $owner->email,
                'photo' => $owner->profile_photo,
                'role'  => 'owner',
            ],
            'participants' => $participants->map(fn($user) => [
                'id'         => $user->id,
                'name'       => $user->name,
                'email'      => $user->email,
                'photo'      => $user->profile_photo,
                'status'     => $user->pivot->status,
                'invited_at' => $user->pivot->invited_at,
                'joined_at'  => $user->pivot->joined_at,
            ]),
        ];
    }

    public function getPlaces(Workspace $workspace): \Illuminate\Support\Collection
    {
        return $workspace->places()
            ->with(['place.city', 'place.images'])
            ->get()
            ->map(fn($wp) => [
                'workspace_place_id' => $wp->id,
                'added_at'           => $wp->created_at,
                'place' => [
                    'id'       => $wp->place->id,
                    'name_ar'  => $wp->place->name_ar,
                    'name_en'  => $wp->place->name_en,
                    'category' => $wp->place->category,
                    'city'     => $wp->place->city?->name_en,
                    'main_image' => $wp->place->images
                        ->where('is_main', true)
                        ->first()?->image_url,
                ],
            ]);
    }

    public function getTimeline(Workspace $workspace): array
    {
        $items = $workspace->timelineItems()
            ->with(['participants.user'])
            ->orderBy('planned_date')
            ->orderBy('order_in_day')
            ->get();

        return $items
            ->groupBy(fn($item) => $item->planned_date->format('Y-m-d'))
            ->map(fn($dayItems, $date) => [
                'date'  => $date,
                'items' => $dayItems->values(),
            ])
            ->values()
            ->toArray();
    }

    public function getSuggestions(Workspace $workspace): \Illuminate\Support\Collection
    {
        return WorkspaceSuggestion::with('suggester')
            ->where('workspace_id', $workspace->id)
            ->latest()
            ->get();
    }

    public function delete(Workspace $workspace): void
    {
        $workspace->delete();
    }
}