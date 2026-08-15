<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Guide;
use App\Models\User;
use App\Models\City;

class GuidesSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $cities = City::pluck('id')->toArray();

        if (empty($cities)) {
            $this->command->warn('⚠️ No cities found — skipping GuidesSeeder');
            return;
        }

        // Create guides for some users who don't have one yet
        $users = User::doesntHave('guide')->inRandomOrder()->take(12)->get();

        foreach ($users as $user) {
            Guide::firstOrCreate(
                ['user_id' => $user->id],
                [
                    'city_id' => $cities[array_rand($cities)],
                    'verification_status' => ['pending', 'approved', 'rejected'][array_rand(['pending', 'approved', 'rejected'])],
                    'specializations' => ['history', 'nature'],
                    'availability' => [],
                ]
            );

            // ensure role
            if (!$user->hasRole('guide')) {
                $user->assignRole('guide');
            }
        }

        $this->command->info('✅ Guides seeded/ensured for selected users');
    }
}
