<?php

namespace Database\Seeders;

use App\Models\Accommodation;
use App\Models\AccommodationBooking;
use App\Models\User;
use App\Models\Workspace;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AccommodationBookingSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $existing = AccommodationBooking::count();
        $target = 12;

        if ($existing >= $target) {
            if ($this->command) {
                $this->command->info("Accommodation bookings exist: {$existing}, skipping creation.");
            }
            return;
        }

        $accommodations = Accommodation::query()->pluck('id')->toArray();
        $tourists = User::query()->pluck('id')->toArray();
        $workspaceIds = Workspace::query()->pluck('id')->toArray();

        if (empty($accommodations) || empty($tourists)) {
            if ($this->command) {
                $this->command->warn('⚠️ Not enough accommodations or users — skipping AccommodationBookingSeeder');
            }
            return;
        }

        $toCreate = $target - $existing;

        for ($i = 0; $i < $toCreate; $i++) {
            $accommodationId = $accommodations[array_rand($accommodations)];
            $touristId = $tourists[array_rand($tourists)];
            $start = now()->addDays(rand(-20, 35))->startOfDay();
            $days = rand(1, 5);
            $end = (clone $start)->addDays($days);

            $status = ['pending', 'accepted', 'declined', 'cancelled'][array_rand(['pending', 'accepted', 'declined', 'cancelled'])];
            $roomType = ['private', 'shared'][array_rand(['private', 'shared'])];
            $workspaceId = !empty($workspaceIds) && (bool) rand(0, 1) ? $workspaceIds[array_rand($workspaceIds)] : null;

            AccommodationBooking::firstOrCreate(
                [
                    'tourist_user_id' => $touristId,
                    'accommodation_id' => $accommodationId,
                    'check_in' => $start->format('Y-m-d'),
                    'check_out' => $end->format('Y-m-d'),
                ],
                [
                    'room_type' => $roomType,
                    'status' => $status,
                    'workspace_id' => $workspaceId,
                ]
            );
        }

        if ($this->command) {
            $this->command->info('✅ Accommodation bookings seeded');
        }
    }
}
