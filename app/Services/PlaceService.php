<?php

namespace App\Services;

use App\Models\Place;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class PlaceService
{
    public function getAll(array $filters = []): LengthAwarePaginator
    {
        $query = Place::with(['city', 'images']);

        // فلترة حسب المدينة
        if (!empty($filters['city_id'])) {
            $query->where('city_id', $filters['city_id']);
        }

        // فلترة حسب الفئة
        if (!empty($filters['category'])) {
            $query->where('category', $filters['category']);
        }

        // ترتيب حسب التقييم
        if (!empty($filters['sort']) && $filters['sort'] === 'rating') {
            $query->orderBy('avg_rating', 'desc');
        } else {
            $query->orderBy('name_en');
        }

        return $query->paginate(15);
    }

    public function findById(int $id): Place
    {
        return Place::with(['city', 'images'])->findOrFail($id);
    }

    public function create(array $data, int $adminId): Place
    {
        return Place::create([
            ...$data,
            'created_by' => $adminId,
        ]);
    }

    public function update(Place $place, array $data): Place
    {
        $place->update($data);
        return $place->fresh(['city', 'images']);
    }

    public function delete(Place $place): void
    {
        $place->delete();
    }
}