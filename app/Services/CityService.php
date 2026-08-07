<?php

namespace App\Services;

use App\Models\City;
use Illuminate\Pagination\LengthAwarePaginator;

class CityService
{
    public function getAll(array $filters = []): LengthAwarePaginator
    {
        $query = City::withCount('places'); // ← عدد الأماكن

        // بحث
        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('name_ar', 'like', '%' . $filters['search'] . '%')
                  ->orWhere('name_en', 'like', '%' . $filters['search'] . '%')
                  ->orWhere('region',  'like', '%' . $filters['search'] . '%');
            });
        }

        return $query->orderBy('name_en')->paginate(20);
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