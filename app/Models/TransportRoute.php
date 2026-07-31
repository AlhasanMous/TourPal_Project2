<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TransportRoute extends Model
{
    protected $fillable = [
        'company_id',
        'origin_city_id',
        'destination_city_id',
        'transport_type',
        'duration_minutes',
        'price_approx',
        'schedule_notes',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'price_approx' => 'decimal:2',
            'is_active'    => 'boolean',
        ];
    }

    // Model Event — لما يُحذف الـ Route، احذف Timeline Items المرتبطة
    protected static function booted(): void
    {
        static::deleting(function (TransportRoute $route) {
            WorkspaceTimelineItem::where('item_type', 'transport')
                ->where('reference_id', $route->id)
                ->delete();
        });
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(TransportCompany::class, 'company_id');
    }

    public function originCity(): BelongsTo
    {
        return $this->belongsTo(City::class, 'origin_city_id');
    }

    public function destinationCity(): BelongsTo
    {
        return $this->belongsTo(City::class, 'destination_city_id');
    }

    // Scope — المسارات النشطة فقط
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}