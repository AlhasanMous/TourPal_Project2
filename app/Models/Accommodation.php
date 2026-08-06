<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;

class Accommodation extends Model
{
    protected $fillable = [
        'host_user_id',
        'name',
        'type',
        'city_id',
        'photos',
        'capacity',
        'price_range',
        'verification_status',
        'verified_at',
        'rejection_reason',
    ];

    protected function casts(): array
    {
        return [
            'photos'      => 'array',
            'verified_at' => 'datetime',
        ];
    }

    public function host(): BelongsTo
    {
        return $this->belongsTo(User::class, 'host_user_id');
    }

    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class);
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(AccommodationBooking::class);
    }

    public function reviews(): MorphMany
    {
        return $this->morphMany(Review::class, 'reviewable');
    }
    public function images(): MorphMany
{
    return $this->morphMany(Image::class, 'imageable')
                ->orderBy('sort_order');
}

public function mainImage(): MorphOne
{
    return $this->morphMany(Image::class, 'imageable')
                ->where('is_main', true);
}
}
