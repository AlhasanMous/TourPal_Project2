<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Review;
use App\Models\User;
use App\Models\Place;
use App\Models\Guide;

class ReviewsSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $count = Review::count();
        $target = 80;

        if ($count >= $target) {
            $this->command->info("Reviews exist: {$count}, skipping creation.");
            return;
        }

        $places = Place::pluck('id')->toArray();
        $guides = Guide::pluck('id')->toArray();
        $users = User::pluck('id')->toArray();

        if (empty($users)) {
            $this->command->warn('⚠️ No users found — skipping ReviewsSeeder');
            return;
        }

        $toCreate = $target - $count;

        for ($i = 0; $i < $toCreate; $i++) {
            $type = rand(0, 1) === 0 ? 'place' : 'guide';

            if ($type === 'place' && !empty($places)) {
                $reviewable_type = Place::class;
                $reviewable_id = $places[array_rand($places)];
            } elseif (!empty($guides)) {
                $reviewable_type = Guide::class;
                $reviewable_id = $guides[array_rand($guides)];
            } else {
                continue;
            }

            Review::firstOrCreate([
                'reviewer_user_id' => $users[array_rand($users)],
                'reviewable_type' => $reviewable_type,
                'reviewable_id' => $reviewable_id,
            ], [
                'rating' => rand(3, 5),
                'content' => 'Sample review for seeding.',
            ]);
        }

        $this->command->info('✅ Reviews seeded');
    }
}
