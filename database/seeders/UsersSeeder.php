<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;

class UsersSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $target = 30;
        $current = User::count();

        if ($current >= $target) {
            $this->command->info("Users exist: {$current}, skipping factory creation.");
            return;
        }

        $toCreate = $target - $current;
        User::factory($toCreate)->create();

        $this->command->info("✅ Created {$toCreate} users (total now: " . User::count() . ")");
    }
}
