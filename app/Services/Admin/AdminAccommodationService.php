<?php

namespace App\Services\Admin;

use App\Models\Accommodation;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
class AdminAccommodationService
{
    public function getAll(array $filters = []): LengthAwarePaginator
    {
        $query = Accommodation::with(['host', 'city', 'images'])
                              ->withCount(['bookings', 'reviews']);

        if (!empty($filters['status'])) {
            $query->where('verification_status', $filters['status']);
        }

        if (!empty($filters['city_id'])) {
            $query->where('city_id', $filters['city_id']);
        }

        if (!empty($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        if (!empty($filters['search'])) {
            $query->where('name', 'like', '%' . $filters['search'] . '%');
        }

        return $query->latest()->paginate(20);
    }

    public function findById(int $id): Accommodation
    {
        return Accommodation::with(['host', 'city', 'images'])
                            ->withCount(['bookings', 'reviews'])
                            ->findOrFail($id);
    }

  public function getPending(): LengthAwarePaginator
{
    return Accommodation::with(['host', 'city', 'images'])
        ->where('verification_status', 'pending')
        ->latest()
        ->paginate(20);
}

   public function create(array $data): Accommodation
{
    return DB::transaction(function () use ($data) {

        $image = $data['image'] ?? null;
        $imageUrl = $data['image_url'] ?? null;

        unset($data['image'], $data['image_url']);

        $host = User::findOrFail($data['host_user_id']);

        if (!$host->hasRole('host')) {
            $host->assignRole('host');
        }

        $accommodation = Accommodation::create([
            ...$data,
            'verification_status' => 'pending',
        ]);

        if ($image && $image->isValid()) {

            $path = $image->store('accommodations', 'public');

            $this->createMainImage(
                $accommodation,
                '/storage/' . $path
            );

        } elseif ($imageUrl) {

            $storedUrl = $this->storeWebImage($imageUrl);

            if ($storedUrl) {
                $this->createMainImage(
                    $accommodation,
                    $storedUrl
                );
            }
        }

        return $accommodation->load([
            'host',
            'city',
            'images',
        ]);
    });
}

    public function verify(Accommodation $accommodation, string $action, ?string $reason): Accommodation
    {
      if ($accommodation->verification_status === 'approved' && $action === 'verify') {
            throw new \Exception('هذه الإقامة محققة مسبقاً');
        }

        DB::transaction(function () use ($accommodation, $action, $reason) {
           if ($action === 'verify') {
            $accommodation->update([
                'verification_status' => 'approved',
                'verified_at'         => now(),
                'rejection_reason'    => null,
                 ]);

                Notification::create([
                    'user_id' => $accommodation->host_user_id,
                    'type'    => 'accommodation_verified',
                    'data'    => [
                        'accommodation_id'   => $accommodation->id,
                        'accommodation_name' => $accommodation->name,
                        'message'            => 'تهانينا! تم اعتماد إقامتك',
                    ],
                ]);
            } else {
                $accommodation->update([
                    'verification_status' => 'rejected',
                    'verified_at'         => null,
                    'rejection_reason'    => $reason,
                ]);

                Notification::create([
                    'user_id' => $accommodation->host_user_id,
                    'type'    => 'accommodation_rejected',
                    'data'    => [
                        'accommodation_id'   => $accommodation->id,
                        'accommodation_name' => $accommodation->name,
                        'message'            => 'نأسف، لم يتم اعتماد إقامتك',
                        'rejection_reason'   => $reason,
                    ],
                ]);
            }
        });

        return $accommodation->fresh(['host', 'city']);
    }
 // ── Image Helpers ──────────────────────────────────────────────

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

            $ext      = $this->guessExtension($response);
            $filename = 'accommodations/' . Str::random(40) . '.' . $ext;
            Storage::disk('public')->put($filename, $response->body());

            return '/storage/' . $filename;
        } catch (\Throwable) {
            return null;
        }
    }

    private function guessExtension($response): string
    {
        $ct = $response->header('Content-Type') ?? '';
        return match (true) {
            str_contains($ct, 'image/webp') => 'webp',
            str_contains($ct, 'image/png')  => 'png',
            str_contains($ct, 'image/gif')  => 'gif',
            default                          => 'jpg',
        };
    }
}
    
