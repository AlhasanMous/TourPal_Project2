<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;

class Guide extends Model
{
    protected $fillable = [
        'user_id',
        'city_id',
        'verification_status',
        'verified_at',
        'rejection_reason',
        'specializations',
        'availability',
    ];

    protected function casts(): array
    {
        return [
            'specializations' => 'array',
            'availability' => 'array',
            'specializations' => 'array',
            'verified_at'  => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class);
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(GuideBooking::class);
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

    // public function mainImage(): MorphOne
    // {
    //     return $this->morphMany(Image::class, 'imageable')
    //                 ->where('is_main', true);
    // }
    // الصح ✅
    public function mainImage(): MorphOne
    {
        return $this->morphOne(Image::class, 'imageable')
            ->where('is_main', true);
    }
}
