<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Workspace;
use App\Models\WorkspacePlace;
use App\Models\WorkspaceTimelineItem;
use App\Models\WorkspaceSuggestion;
use App\Models\User;
use App\Models\Place;
use Illuminate\Support\Str;

class WorkspaceSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $existing = Workspace::count();
        $target = 20;

        if ($existing >= $target) {
            $this->command->info("Workspaces exist: {$existing}, skipping creation.");
            return;
        }

        $toCreate = $target - $existing;

        $users = User::pluck('id')->toArray();
        $places = Place::pluck('id')->toArray();

        if (empty($users) || empty($places)) {
            $this->command->warn('⚠️ Not enough users or places to seed workspaces.');
            return;
        }

        for ($i = 0; $i < $toCreate; $i++) {
            $owner = $users[array_rand($users)];

            $start = now()->addDays(rand(1, 30))->startOfDay();
            // Ensure trip spans more than a week
            $days = rand(8, 14);
            $end = (clone $start)->addDays($days - 1);

            $name = 'Trip ' . Str::random(6) . ' to ' . Place::find($places[array_rand($places)])->name_en;

            $workspace = Workspace::create([
                'name' => $name,
                'description' => 'A seeded trip plan for testing and demo.',
                'owner_user_id' => $owner,
                'trip_start_date' => $start->format('Y-m-d'),
                'trip_end_date' => $end->format('Y-m-d'),
                'is_public' => (bool) rand(0, 1),
            ]);

            // create activities (>=6) distributed across the trip days
            $countActivities = rand(6, 10);
            $lastPlannedDate = clone $start;
            for ($a = 0; $a < $countActivities; $a++) {
                // compute a day offset to spread activities sequentially without overlap
                $dayOffset = (int) floor($a * ($days / $countActivities));
                $activityDate = (clone $start)->addDays($dayOffset);

                // each activity links to 1-3 places
                $numPlaces = rand(1, 3);
                $activityPlaces = [];
                for ($pi = 0; $pi < $numPlaces; $pi++) {
                    $placeId = $places[array_rand($places)];
                    // ensure workspace has the place
                    WorkspacePlace::firstOrCreate([
                        'workspace_id' => $workspace->id,
                        'place_id' => $placeId,
                    ], [
                        'added_by' => $owner,
                    ]);

                    $activityPlaces[] = $placeId;
                }

                // create timeline items for the activity's places sequentially in the same day
                foreach ($activityPlaces as $j => $placeId) {
                    $timeHour = 8 + ($j * 3); // 08:00, 11:00, 14:00
                    $plannedTime = sprintf('%02d:00', $timeHour);
                    $orderInDay = ($a * 10) + ($j + 1); // keep unique ordering

                    $placeModel = Place::find($placeId);

                    WorkspaceTimelineItem::create([
                        'workspace_id' => $workspace->id,
                        'planned_date' => $activityDate->format('Y-m-d'),
                        'planned_time' => $plannedTime,
                        'order_in_day' => $orderInDay,
                        'item_type' => 'place',
                        'reference_id' => $placeId,
                        'label' => $placeModel?->name_en ?? 'Place',
                        'notes' => 'Activity visit to ' . ($placeModel?->name_en ?? 'Place'),
                        'added_by' => $owner,
                    ]);
                }

                $lastPlannedDate = (clone $activityDate);
            }

            // add 3-6 participants (actual)
            $participants = (array) array_rand(array_flip($users), rand(3, 6));
            if (!is_array($participants)) $participants = [$participants];

            foreach ($participants as $p) {
                if ($p == $owner) continue;
                $workspace->participants()->syncWithoutDetaching([$p => ['status' => 'accepted']]);
            }

            // add suggestions from participants (1-3)
            $participantList = $workspace->participants()->pluck('user_id')->toArray();
            if (empty($participantList)) {
                $participantList = $participants;
            }

            $numSuggestions = rand(1, 3);
            for ($s = 0; $s < $numSuggestions; $s++) {
                $suggester = $participantList[array_rand($participantList)];
                $suggestedPlaces = [];
                $numSuggested = rand(1, 3);
                for ($sp = 0; $sp < $numSuggested; $sp++) {
                    $suggestedPlaces[] = $places[array_rand($places)];
                }

                WorkspaceSuggestion::create([
                    'workspace_id' => $workspace->id,
                    'suggester_user_id' => $suggester,
                    'type' => 'add_place',
                    'payload' => ['place_ids' => $suggestedPlaces],
                    'note' => 'Suggested places to visit by participant',
                    'status' => 'pending',
                ]);
            }

            $this->command->info("✅ Workspace created: {$workspace->name} (activities: {$countActivities})");
        }

        $this->command->info('🎉 Workspace seeding completed');
    }
}
