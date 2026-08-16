<?php

namespace App\Services;

use App\Models\Guide;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
class GuideProfileService
{
    // ─────────────────────────────────────────
    // إنشاء Profile — Guide
    // ─────────────────────────────────────────
    public function createProfile(User $user, array $data): Guide
    {
        // تحقق ما عنده profile مسبقاً
        if (Guide::where('user_id', $user->id)->exists()) {
            throw ValidationException::withMessages([
                'profile' => ['لديك حساب مرشد مسبقاً'],
            ]);
        }

       return DB::transaction(function () use ($user, $data) {
    // ── فصل الصورة أولاً ──────────────────────
    $image    = $data['image']     ?? null;
    $imageUrl = $data['image_url'] ?? null;
    unset($data['image'], $data['image_url']);

    // ── إنشاء الـ Guide ────────────────────────
    $guide = Guide::create([
        'user_id'             => $user->id,
        'city_id'             => $data['city_id'],
        'verification_status' => 'pending',
        'specializations'     => $data['specializations'] ?? null,
        'availability'        => $data['availability'] ?? [],
    ]);

    // ── حفظ الصورة ────────────────────────────
    if ($image && $image->isValid()) {
        $path = $image->store('guides', 'public');
        $guide->images()->create([
            'image_url'  => '/storage/' . $path,
            'is_main'    => true,
            'sort_order' => 1,
        ]);
    } elseif ($imageUrl) {
        $stored = $this->storeWebImage($imageUrl);
        if ($stored) {
            $guide->images()->create([
                'image_url'  => $stored,
                'is_main'    => true,
                'sort_order' => 1,
            ]);
        }
    }

    // ── إشعار الأدمن ──────────────────────────
    $admin = User::role('admin', 'api')->first();
    if ($admin) {
        Notification::create([
            'user_id' => $admin->id,
            'type'    => 'new_guide_application',
            'data'    => [
                'guide_id'   => $guide->id,
                'guide_name' => $user->name,
                'message'    => 'طلب تسجيل مرشد جديد بانتظار المراجعة',
            ],
        ]);
    }

    return $guide->load(['city', 'images']);
});
    }
    // ─────────────────────────────────────────
    // جلب Profile — Guide
    // ─────────────────────────────────────────
    public function getProfile(User $user): Guide
    {
        $guide = Guide::with(['city', 'images'])
            ->where('user_id', $user->id)
            ->first();

        if (!$guide) {
            throw ValidationException::withMessages([
                'profile' => ['لم تقم بإنشاء حساب مرشد بعد'],
            ]);
        }

        return $guide;
    }

    // ─────────────────────────────────────────
    // تعديل Profile — Guide
    // ─────────────────────────────────────────
 public function updateProfile(User $user, array $data): Guide
{
    $guide = Guide::where('user_id', $user->id)->first();

    if (!$guide) {
        throw ValidationException::withMessages([
            'profile' => ['لم تقم بإنشاء حساب مرشد بعد'],
        ]);
    }

    // ── فصل الصورة ────────────────────────────
    $image    = $data['image']     ?? null;
    $imageUrl = $data['image_url'] ?? null;
    unset($data['image'], $data['image_url']);

    // ── تحديث البيانات ────────────────────────
    $guide->update($data);

    // ── تحديث الصورة ──────────────────────────
    if ($image && $image->isValid()) {
        $this->removeOldMainImages($guide);
        $path = $image->store('guides', 'public');
        $this->createMainImage($guide, '/storage/' . $path);
    } elseif ($imageUrl) {
        $stored = $this->storeWebImage($imageUrl);
        if ($stored) {
            $this->removeOldMainImages($guide);
            $this->createMainImage($guide, $stored);
        }
    }

    return $guide->fresh(['city', 'images']);
}
private function createMainImage(Guide $guide, string $url): void
{
    $guide->images()->create([
        'image_url'  => $url,
        'is_main'    => true,
        'sort_order' => 1,
    ]);
}

private function removeOldMainImages(Guide $guide): void
{
    foreach ($guide->images as $old) {
        if (!str_starts_with($old->image_url, '/storage/')) continue;
        $path = str_replace('/storage/', '', $old->image_url);
        if (Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }
    }
    $guide->images()->delete();
}

private function storeWebImage(string $url): ?string
{
    try {
        $response = Http::withOptions(['verify' => false])->timeout(30)->get($url);
        if (!$response->successful()) return null;
        $ext      = $this->guessExtension($response);
        $filename = 'guides/' . Str::random(40) . '.' . $ext;
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

