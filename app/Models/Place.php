<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Place extends Model
{
    protected $fillable = [
        'name_ar',
        'name_en',
        'description_ar',
        'description_en',
        'city_id',
        'category',
        'photos',
        'avg_rating',
        'visit_duration_hours',
        'opening_hours',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'photos'        => 'array',
            'opening_hours' => 'array',
            'avg_rating'    => 'decimal:2',
        ];
    }

    // Model Event — لما يُحذف المكان، احذف Timeline Items المرتبطة
    protected static function booted(): void
    {
        static::deleting(function (Place $place) {
            WorkspaceTimelineItem::where('item_type', 'place')
                ->where('reference_id', $place->id)
                ->delete();
        });
    }

    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class);
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function reviews(): MorphMany
    {
        return $this->morphMany(Review::class, 'reviewable');
    }

    public function wishlists(): HasMany
    {
        return $this->hasMany(Wishlist::class);
    }

    public function workspacePlaces(): HasMany
    {
        return $this->hasMany(WorkspacePlace::class);
    }
}