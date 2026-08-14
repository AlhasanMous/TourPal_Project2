<?php

namespace App\Services;

use App\Models\Place;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PlaceService
{
    public function getAll(array $filters = []): LengthAwarePaginator
    {
        $query = Place::with(['city', 'images']);

        if (!empty($filters['city_id'])) {
            $query->where('city_id', $filters['city_id']);
        }

        if (!empty($filters['category'])) {
            $query->where('category', $filters['category']);
        }

        if (!empty($filters['sort']) && $filters['sort'] === 'rating') {
            $query->orderBy('avg_rating', 'desc');
        } else {
            $query->orderBy('name_en');
        }

        return $query->paginate(15);
    }


    public function findById(int $id): Place
    {
        return Place::with(['city', 'images'])
            ->findOrFail($id);
    }


    public function create(array $data, int $adminId): Place
    {
        $image = $data['image'] ?? null;
        $imageUrl = $data['image_url'] ?? null;

        unset($data['image'], $data['image_url']);

        $place = Place::create([
            ...$data,
            'created_by' => $adminId,
        ]);

        if ($image && $image->isValid()) {
            $path = $image->store('places', 'public');

            $place->images()->create([
                'image_url' => '/storage/' . $path,
                'is_main' => true,
                'sort_order' => 1,
            ]);
        } elseif ($imageUrl) {
            $storedUrl = $this->storeWebImage($imageUrl);

            if ($storedUrl) {
                $place->images()->create([
                    'image_url' => $storedUrl,
                    'is_main' => true,
                    'sort_order' => 1,
                ]);
            }
        }

        return $place->load('images');
    }



    public function update(Place $place, array $data): Place
    {
        $image = $data['image'] ?? null;
        $imageUrl = $data['image_url'] ?? null;

        unset($data['image'], $data['image_url']);

        // تحديث البيانات النصية
        $place->update($data);

        if ($image && $image->isValid()) {
            $this->removeOldMainStorageImages($place);

            $path = $image->store('places', 'public');

            $this->createMainImage($place, '/storage/' . $path);
        } elseif ($imageUrl) {
            $storedUrl = $this->storeWebImage($imageUrl);

            if ($storedUrl) {
                $this->removeOldMainStorageImages($place);
                $this->createMainImage($place, $storedUrl);
            }
        }

        return $place->fresh([
            'city',
            'images'
        ]);
    }


    private function removeOldMainStorageImages(Place $place): void
    {
        foreach ($place->images as $oldImage) {
            // Only delete local files; leave external URLs untouched
            if (!str_starts_with($oldImage->image_url, '/storage/')) {
                continue;
            }

            $oldPath = str_replace('/storage/', '', $oldImage->image_url);

            if (Storage::disk('public')->exists($oldPath)) {
                Storage::disk('public')->delete($oldPath);
            }
        }

        $place->images()->delete();
    }


    private function createMainImage(Place $place, string $url): void
    {
        $place->images()->create([
            'image_url' => $url,
            'is_main' => true,
            'sort_order' => 1,
        ]);
    }


    private function storeWebImage(string $url): ?string
    {
        try {
            $response = Http::withOptions([
                'verify' => false,
            ])->timeout(30)->get($url);

            if (!$response->successful()) {
                return null;
            }

            $content = $response->body();
            $extension = $this->guessExtensionFromResponse($response);
            $filename = 'places/' . Str::random(40) . '.' . $extension;

            Storage::disk('public')->put($filename, $content);

            return '/storage/' . $filename;
        } catch (\Throwable $e) {
            return null;
        }
    }


    private function guessExtensionFromResponse($response): string
    {
        $contentType = $response->header('Content-Type') ?? '';

        return match (true) {
            str_contains($contentType, 'image/webp') => 'webp',
            str_contains($contentType, 'image/png') => 'png',
            str_contains($contentType, 'image/gif') => 'gif',
            default => 'jpg',
        };
    }



    public function delete(Place $place): void
    {
        $place->delete();
    }
}
