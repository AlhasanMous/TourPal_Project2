<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;
class User extends Authenticatable
{
    use HasFactory, Notifiable, HasRoles, SoftDeletes;

    protected $fillable = [
        'name',
        'email',
        'password_hash',
        'profile_photo',
        'bio',
        'languages',
        'is_matching_enabled',
    ];

    protected $hidden = [
        'password_hash',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at'   => 'datetime',
            'password_hash'       => 'hashed',
            'languages'           => 'array',
            'is_matching_enabled' => 'boolean',
        ];
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

    public function wishlist(): HasMany
    {
        return $this->hasMany(Wishlist::class);
    }

    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class);
    }
}
