<?php

namespace Database\Seeders;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class NotificationSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $target = 20;
        $existing = Notification::count();

        if ($existing >= $target) {
            if ($this->command) {
                $this->command->info("Notifications exist: {$existing}, skipping creation.");
            }
            return;
        }

        $users = User::pluck('id')->toArray();

        if (empty($users)) {
            if ($this->command) {
                $this->command->warn('⚠️ No users found — skipping NotificationSeeder');
            }
            return;
        }

        $toCreate = max(0, $target - $existing);

        $templates = [
            [
                'type' => 'workspace_invite',
                'data' => [
                    'workspace_id' => 1,
                    'workspace_name' => 'Spring Trip',
                    'inviter_id' => 1,
                ],
            ],
            [
                'type' => 'booking_accepted',
                'data' => [
                    'booking_id' => 1,
                    'accommodation_name' => 'Damascus Guest House',
                    'status' => 'accepted',
                ],
            ],
            [
                'type' => 'booking_declined',
                'data' => [
                    'booking_id' => 1,
                    'accommodation_name' => 'Aleppo Old House',
                    'status' => 'declined',
                ],
            ],
            [
                'type' => 'guide_verified',
                'data' => [
                    'guide_id' => 1,
                    'status' => 'approved',
                ],
            ],
            [
                'type' => 'system_message',
                'data' => [
                    'title' => 'Welcome',
                    'message' => 'Welcome to TourPal',
                ],
            ],
        ];

        $seeded = 0;
        $createdCount = 0;
        $adminUserId = User::where('email', 'admin@tourpal.sy')->value('id');

        while ($createdCount < $toCreate) {
            $userId = $adminUserId ?? $users[$createdCount % count($users)];

            if ($createdCount > 0 && $adminUserId) {
                $userId = $users[$createdCount % count($users)];
            }

            $template = $templates[array_rand($templates)];

            $payload = [
                'user_id' => $userId,
                'type' => $template['type'],
                'data' => [
                    ...$template['data'],
                    'sequence' => $seeded + 1,
                    'created_for' => 'seeder',
                    'message' => ($template['type'] === 'system_message')
                        ? 'Welcome to TourPal — message #' . ($seeded + 1)
                        : ($template['type'] === 'workspace_invite'
                            ? 'You were invited to join workspace #' . ($seeded + 1)
                            : 'Notification #' . ($seeded + 1)),
                ],
                'read_at' => rand(0, 1) ? now()->subDays(rand(1, 7)) : null,
            ];

            Notification::create($payload);
            $createdCount++;
            $seeded++;
        }

        if ($this->command) {
            $this->command->info('✅ Notifications seeded: ' . $createdCount . ' across ' . count($users) . ' users.');
        }
    }
}
