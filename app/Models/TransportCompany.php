<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TransportCompany extends Model
{
    protected $fillable = [
        'name_ar',
        'name_en',
        'phone',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    public function routes(): HasMany
    {
        return $this->hasMany(TransportRoute::class, 'company_id');
    }

    // Scope — الشركات النشطة فقط
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}