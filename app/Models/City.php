<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany; 
class City extends Model
{
    protected $fillable = [
        'name_ar',
        'name_en',
        'region',
    ];

    public function places(): HasMany
    {
        return $this->hasMany(Place::class);
    }

    public function guides(): HasMany
    {
        return $this->hasMany(Guide::class);
    }

    public function accommodations(): HasMany
    {
        return $this->hasMany(Accommodation::class);
    }

    public function touristMatches(): HasMany
    {
        return $this->hasMany(TouristMatch::class, 'match_city_id');
    }

    public function originRoutes(): HasMany
    {
        return $this->hasMany(TransportRoute::class, 'origin_city_id');
    }

    public function destinationRoutes(): HasMany
    {
        return $this->hasMany(TransportRoute::class, 'destination_city_id');
    }
}
