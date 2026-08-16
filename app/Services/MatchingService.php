<?php

namespace App\Services;

use App\Models\TouristMatch;
use App\Models\User;
use App\Models\Conversation;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class MatchingService
{
    // ─────────────────────────────────────────
    // حساب + تخزين + إرجاع النتائج
    // ─────────────────────────────────────────
    public function getMatches(User $user): array
    {
        // تحقق إن المستخدم مفعّل عنده المطابقة
        if (!$user->is_matching_enabled) {
            return [];
        }

        // جلب مدن الـ Workspaces تبع المستخدم
        $userCities = $this->getUserCities($user->id);

        if ($userCities->isEmpty()) {
            return [];
        }

        // جلب السياح الآخرين اللي عندهم نفس المدن
        $potentialMatches = User::where('id', '!=', $user->id)
            ->where('is_matching_enabled', true)
            ->whereHas('workspaces', fn($q) =>
                $q->whereHas('places', fn($q2) =>
                    $q2->whereIn('places.city_id', $userCities)
                )
            )
            ->with(['workspaces.places.city'])
            ->get();

        $results = [];

        foreach ($potentialMatches as $otherUser) {
            $otherCities = $this->getUserCities($otherUser->id);
            $sharedCities = $userCities->intersect($otherCities);

            if ($sharedCities->isEmpty()) continue;

            foreach ($sharedCities as $cityId) {
                // user1_id دايماً الأصغر (BR)
                $user1Id = min($user->id, $otherUser->id);
                $user2Id = max($user->id, $otherUser->id);

                // أنشئ أو جلب الـ match الموجود
                $match = TouristMatch::firstOrCreate(
                    [
                        'user1_id'      => $user1Id,
                        'user2_id'      => $user2Id,
                        'match_city_id' => $cityId,
                    ],
                    ['status' => 'pending']
                );

                // ما نعرض المطابقات المرفوضة
                if ($match->status === 'declined') continue;

                $results[] = [
                    'match_id'   => $match->id,
                    'status'     => $match->status,
                    'city_id'    => $cityId,
                    'user'       => [
                        'id'            => $otherUser->id,
                        'name'          => $otherUser->name,
                        'profile_photo' => $otherUser->profile_photo,
                        'languages'     => $otherUser->languages,
                    ],
                ];
            }
        }

        return $results;
    }

    // ─────────────────────────────────────────
    // بعث Connection Request
    // ─────────────────────────────────────────
    public function connect(TouristMatch $match, int $userId): TouristMatch
    {
        // تحقق إن المستخدم جزء من هاد الـ match
        if ($match->user1_id !== $userId && $match->user2_id !== $userId) {
            throw ValidationException::withMessages([
                'match' => ['ليس لديك صلاحية للوصول لهذه المطابقة'],
            ]);
        }

        if ($match->status !== 'pending') {
            throw ValidationException::withMessages([
                'match' => ['هذه المطابقة تمت معالجتها مسبقاً'],
            ]);
        }

        $match->update(['status' => 'connected']);
        $this->createConversation($match);

        return $match->fresh();
    }

    // ─────────────────────────────────────────
    // قبول أو رفض Connection Request
    // ─────────────────────────────────────────
    public function respond(
        TouristMatch $match,
        string $action,
        int $userId
    ): TouristMatch {
        // تحقق إن المستخدم جزء من هاد الـ match
        if ($match->user1_id !== $userId && $match->user2_id !== $userId) {
            throw ValidationException::withMessages([
                'match' => ['ليس لديك صلاحية للرد على هذه المطابقة'],
            ]);
        }

        if ($match->status !== 'connected') {
            throw ValidationException::withMessages([
                'match' => ['لا يوجد طلب تواصل معلق لهذه المطابقة'],
            ]);
        }

        if ($action === 'accept') {
            $match->update(['status' => 'connected']);
        } else {
            $match->update(['status' => 'declined']);
        }

        return $match->fresh();
    }

    // ─────────────────────────────────────────
    // السياح المتصلين
    // ─────────────────────────────────────────
public function getConnections(int $userId): \Illuminate\Support\Collection
{
    return TouristMatch::where('status', 'connected')
        ->where(fn($q) =>
            $q->where('user1_id', $userId)
              ->orWhere('user2_id', $userId)
        )
        ->with(['user1', 'user2', 'city'])
        ->get()
        ->map(function ($match) use ($userId) {
            $otherUser = $match->getOtherUser($userId);
            return [
                'match_id'     => $match->id,
                'city'         => $match->city?->name_en,
                'connected_at' => $match->updated_at,
                'user'         => [
                    'id'            => $otherUser->id,
                    'name'          => $otherUser->name,
                    'profile_photo' => $otherUser->profile_photo,
                    'languages'     => $otherUser->languages,
                ],
            ];
        });
}
    // ─────────────────────────────────────────
    // Helpers
    // ─────────────────────────────────────────
    private function getUserCities(int $userId): \Illuminate\Support\Collection
    {
        return DB::table('workspace_places')
            ->join('workspaces', 'workspace_places.workspace_id', '=', 'workspaces.id')
            ->join('places', 'workspace_places.place_id', '=', 'places.id')
            ->where('workspaces.owner_user_id', $userId)
            ->whereNull('workspaces.deleted_at')
            ->pluck('places.city_id')
            ->unique();
    }

    private function createConversation(TouristMatch $match): void
    {
        $user1Id = min($match->user1_id, $match->user2_id);
        $user2Id = max($match->user1_id, $match->user2_id);

        Conversation::firstOrCreate([
            'participant1_id' => $user1Id,
            'participant2_id' => $user2Id,
        ]);
    }
}