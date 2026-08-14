<?php

namespace App\Services;

use App\Models\Guide;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

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
            $guide = Guide::create([
                'user_id'             => $user->id,
                'city_id'             => $data['city_id'],
                'verification_status' => 'pending',
                'specializations'     => $data['specializations'] ?? null,
                'availability'        => $data['availability'] ?? [],
            ]);

            // إشعار للـ Admin — طلب جديد بانتظار المراجعة
            // نجيب أول admin موجود في النظام
            $admin = User::role('admin')->first();
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

            return $guide;
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

        $guide->update(array_filter($data, fn($v) => !is_null($v)));

        return $guide->fresh(['city', 'images']);
    }
}