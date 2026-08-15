<?php

namespace App\Services;

use App\Models\Accommodation;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AccommodationService
{
    // ─── Public — عرض الكل ───────────────────────────────
    public function getAll(array $filters = []): LengthAwarePaginator
    {
        $query = Accommodation::with(['city', 'images'])
            ->where('verification_status', 'approved');

        if (!empty($filters['city_id'])) {
            $query->where('city_id', $filters['city_id']);
        }

        if (!empty($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        return $query->latest()->paginate(15);
    }

    // ─── Host — accommodations تبعه ──────────────────────
    public function getHostAccommodations(int $hostId): LengthAwarePaginator
    {
        return Accommodation::with(['city', 'images'])
            ->where('host_user_id', $hostId)
            ->latest()
            ->paginate(15);
    }

    public function findById(int $id): Accommodation
    {
        return Accommodation::with(['city', 'images', 'host'])
            ->findOrFail($id);
    }

    // ─── Host — إنشاء accommodation ──────────────────────
    public function create(array $data, int $hostId): Accommodation
    {
        $image    = $data['image'] ?? null;
        $imageUrl = $data['image_url'] ?? null;

        unset($data['image'], $data['image_url']);

        $accommodation = Accommodation::create([
            ...$data,
            'host_user_id'        => $hostId,
            'verification_status' => 'pending',
        ]);

        if ($image && $image->isValid()) {
            $path = $image->store('accommodations', 'public');
            $this->createMainImage($accommodation, '/storage/' . $path);
        } elseif ($imageUrl) {
            $storedUrl = $this->storeWebImage($imageUrl);
            if ($storedUrl) {
                $this->createMainImage($accommodation, $storedUrl);
            }
        }

        return $accommodation->load(['city', 'images']);
    }

    // ─── Host — تعديل accommodation ──────────────────────
    public function update(Accommodation $accommodation, array $data): Accommodation
    {
        $image    = $data['image'] ?? null;
        $imageUrl = $data['image_url'] ?? null;

        unset($data['image'], $data['image_url']);

        $accommodation->update($data);

        if ($image && $image->isValid()) {
            $this->removeOldMainStorageImages($accommodation);
            $path = $image->store('accommodations', 'public');
            $this->createMainImage($accommodation, '/storage/' . $path);
        } elseif ($imageUrl) {
            $storedUrl = $this->storeWebImage($imageUrl);
            if ($storedUrl) {
                $this->removeOldMainStorageImages($accommodation);
                $this->createMainImage($accommodation, $storedUrl);
            }
        }

        return $accommodation->fresh(['city', 'images']);
    }

    // ─── Host — حذف accommodation ────────────────────────
    public function delete(Accommodation $accommodation, int $hostId): void
    {
        if ($accommodation->host_user_id !== $hostId) {
           throw ValidationException::withMessages([
         'accommodation' => ['ليس لديك صلاحية لحذف هذا المكان'],
        ]);
        }

        // احذف الصور المحلية
        foreach ($accommodation->images as $image) {
            if (str_starts_with($image->image_url, '/storage/')) {
                $path = str_replace('/storage/', '', $image->image_url);
                Storage::disk('public')->delete($path);
            }
        }

        $accommodation->delete();
    }

    // ─── Helpers ──────────────────────────────────────────
    private function removeOldMainStorageImages(Accommodation $accommodation): void
    {
        foreach ($accommodation->images as $oldImage) {
            if (!str_starts_with($oldImage->image_url, '/storage/')) {
                continue;
            }
            $oldPath = str_replace('/storage/', '', $oldImage->image_url);
            if (Storage::disk('public')->exists($oldPath)) {
                Storage::disk('public')->delete($oldPath);
            }
        }
        $accommodation->images()->delete();
    }

    private function createMainImage(Accommodation $accommodation, string $url): void
    {
        $accommodation->images()->create([
            'image_url'  => $url,
            'is_main'    => true,
            'sort_order' => 1,
        ]);
    }

    private function storeWebImage(string $url): ?string
    {
        try {
            $response = Http::withOptions(['verify' => false])
                ->timeout(30)
                ->get($url);

            if (!$response->successful()) return null;

            $content   = $response->body();
            $extension = $this->guessExtensionFromResponse($response);
            $filename  = 'accommodations/' . Str::random(40) . '.' . $extension;

            Storage::disk('public')->put($filename, $content);

            return '/storage/' . $filename;
        } catch (\Throwable $e) {
            return null;
        }
    }

    private function guessExtensionFromResponse($response): string
    {
        $contentType = $response->header('Content-Type') ?? '';

        return match(true) {
            str_contains($contentType, 'image/webp') => 'webp',
            str_contains($contentType, 'image/png')  => 'png',
            str_contains($contentType, 'image/gif')  => 'gif',
            default                                   => 'jpg',
    };
}
}
