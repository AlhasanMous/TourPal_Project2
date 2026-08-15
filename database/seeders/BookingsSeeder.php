<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\GuideBooking;
use App\Models\Guide;
use App\Models\User;

class BookingsSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $count = GuideBooking::count();
        $target = 40;

        if ($count >= $target) {
            $this->command->info("Guide bookings exist: {$count}, skipping creation.");
            return;
        }

        $toCreate = $target - $count;

        $guides = Guide::pluck('id')->toArray();
        $users = User::pluck('id')->toArray();

        if (empty($guides) || empty($users)) {
            $this->command->warn('⚠️ Not enough guides or users — skipping BookingsSeeder');
            return;
        }

        for ($i = 0; $i < $toCreate; $i++) {
            GuideBooking::firstOrCreate([
                'tourist_user_id' => $users[array_rand($users)],
                'guide_id' => $guides[array_rand($guides)],
                'booking_date' => now()->addDays(rand(-10, 20))->format('Y-m-d'),
            ], [
                'start_time' => '09:00',
                'end_time' => '12:00',
                'status' => 'pending',
            ]);
        }

        $this->command->info('✅ Guide bookings seeded');
    }
}
