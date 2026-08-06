<?php

namespace App\Services;

use App\Models\City;
use Illuminate\Database\Eloquent\Collection;

class CityService
{
    public function getAll(): Collection
    {
        return City::orderBy('name_en')->get();
    }

    public function create(array $data): City
    {
        return City::create($data);
    }

    public function update(City $city, array $data): City
    {
        $city->update($data);
        return $city->fresh();
    }

    public function delete(City $city): void
    {
        $city->delete();
    }
}