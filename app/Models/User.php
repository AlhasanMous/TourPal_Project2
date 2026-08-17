<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles, SoftDeletes;

    protected $fillable = [
        'name',
        'email',
        'password_hash',
        'profile_photo',
        'bio',
        'languages',
        'is_matching_enabled',
    ];

    protected $guard_name = 'api';

    protected $hidden = [
        'password_hash',
    ];

    // protected $appends = [
    //     'profile_photo_url',
    // ];

    // public function getProfilePhotoUrlAttribute(): ?string
    // {
    //     if (!$this->profile_photo) {
    //         return null;
    //     }

    //     return asset('storage/' . ltrim($this->profile_photo, '/'));
    // }

    protected function casts(): array
    {
        return [
            'email_verified_at'   => 'datetime',
            'password_hash'       => 'hashed',
            'languages'           => 'array',
            'is_matching_enabled' => 'boolean',
        ];
    }

    /**
     * Get the full public URL for the profile photo.
     */
    protected function profilePhotoUrl(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->profile_photo
                ? asset('storage/' . $this->profile_photo)
                : null
        );
    }

    // علاقات
    public function guide(): HasOne
    {
        return $this->hasOne(Guide::class);
    }

    public function accommodations(): HasMany
    {
        return $this->hasMany(Accommodation::class, 'host_user_id');
    }

    public function ownedWorkspaces(): HasMany
    {
        return $this->hasMany(Workspace::class, 'owner_user_id');
    }

    public function guideBookings(): HasMany
    {
        return $this->hasMany(GuideBooking::class, 'tourist_user_id');
    }

    public function accommodationBookings(): HasMany
    {
        return $this->hasMany(AccommodationBooking::class, 'tourist_user_id');
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class, 'reviewer_user_id');
    }

    public function wishlists(): HasMany
    {
        return $this->hasMany(Wishlist::class);
    }

    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class);
    }

    public function WorkspaceTimelineParticipants(): HasMany
    {
        return $this->hasMany(WorkspaceTimelineParticipant::class);
    }

    public function timelineItems(): HasMany
    {
        return $this->hasMany(WorkspaceTimelineItem::class, 'added_by');
    }
}
