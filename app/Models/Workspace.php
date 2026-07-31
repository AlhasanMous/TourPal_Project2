<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Workspace extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'description',
        'owner_user_id',
        'trip_start_date',
        'trip_end_date',
        'is_public',
    ];

    protected function casts(): array
    {
        return [
            'trip_start_date' => 'date',
            'trip_end_date'   => 'date',
            'is_public'       => 'boolean',
        ];
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_user_id');
    }

    public function places(): HasMany
    {
        return $this->hasMany(WorkspacePlace::class);
    }

    public function participants(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'workspace_participants')
                    ->withPivot('status', 'invited_at', 'joined_at');
    }

    public function timelineItems(): HasMany
    {
        return $this->hasMany(WorkspaceTimelineItem::class);
    }

    public function suggestions(): HasMany
    {
        return $this->hasMany(WorkspaceSuggestion::class);
    }

    public function guideBookings(): HasMany
    {
        return $this->hasMany(GuideBooking::class);
    }

    public function accommodationBookings(): HasMany
    {
        return $this->hasMany(AccommodationBooking::class);
    }
}