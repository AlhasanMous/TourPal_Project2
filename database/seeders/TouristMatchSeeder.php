<?php

namespace Database\Seeders;

use App\Models\TouristMatch;
use App\Models\User;
use App\Models\Workspace;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TouristMatchSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $target = 20;
        $existing = TouristMatch::count();

        if ($existing >= $target) {
            if ($this->command) {
                $this->command->info("Tourist matches exist: {$existing}, skipping creation.");
            }
            return;
        }

        $users = User::query()
            ->where('is_matching_enabled', true)
            ->pluck('id')
            ->toArray();

        if (count($users) < 2) {
            if ($this->command) {
                $this->command->warn('⚠️ Not enough matching-enabled users to seed TouristMatch data.');
            }
            return;
        }

        $created = 0;
        $attempts = 0;
        $seen = [];

        while ($created < ($target - $existing) && $attempts < 200) {
            $attempts++;

            do {
                $user1Id = $users[array_rand($users)];
                $user2Id = $users[array_rand($users)];
            } while ($user1Id === $user2Id);

            [$firstUserId, $secondUserId] = [$user1Id, $user2Id];
            if ($firstUserId > $secondUserId) {
                [$firstUserId, $secondUserId] = [$secondUserId, $firstUserId];
            }

            $cityId = $this->getSharedCityId($firstUserId, $secondUserId);
            if (!$cityId) {
                continue;
            }

            $pairKey = $firstUserId . ':' . $secondUserId . ':' . $cityId;
            if (isset($seen[$pairKey])) {
                continue;
            }

            $seen[$pairKey] = true;

            $workspaceId = $this->getWorkspaceForMatch($firstUserId, $secondUserId, $cityId);
            $status = collect(['pending', 'connected', 'declined'])->random();

            TouristMatch::create([
                'user1_id'      => $firstUserId,
                'user2_id'      => $secondUserId,
                'match_city_id' => $cityId,
                'workspace_id'  => $workspaceId,
                'status'        => $status,
            ]);

            $created++;
        }

        if ($this->command) {
            $this->command->info('✅ Tourist matches seeded: ' . TouristMatch::count());
        }
    }

    private function getSharedCityId(int $user1Id, int $user2Id): ?int
    {
        $user1Cities = $this->cityIdsForUser($user1Id);
        $user2Cities = $this->cityIdsForUser($user2Id);

        $shared = array_values(array_intersect($user1Cities, $user2Cities));

        if (empty($shared)) {
            return null;
        }

        return $shared[array_rand($shared)];
    }

    private function cityIdsForUser(int $userId): array
    {
        return DB::table('workspace_places')
            ->join('workspaces', 'workspace_places.workspace_id', '=', 'workspaces.id')
            ->join('places', 'workspace_places.place_id', '=', 'places.id')
            ->where('workspaces.owner_user_id', $userId)
            ->whereNull('workspaces.deleted_at')
            ->pluck('places.city_id')
            ->unique()
            ->values()
            ->toArray();
    }

    private function getWorkspaceForMatch(int $user1Id, int $user2Id, int $cityId): ?int
    {
        $workspace = Workspace::query()
            ->where(function ($query) use ($user1Id, $user2Id) {
                $query->where('owner_user_id', $user1Id)
                    ->orWhere('owner_user_id', $user2Id);
            })
            ->whereHas('places.place', function ($query) use ($cityId) {
                $query->where('city_id', $cityId);
            })
            ->first();

        return $workspace?->id;
    }
}
