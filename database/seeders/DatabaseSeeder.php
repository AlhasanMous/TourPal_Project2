<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            AdminSeeder::class,
            SyriaDataSeeder::class,
            ImageSeeder::class, // ← لازم يكون هون
            TransportSeeder::class,
            // Added seeders
            UsersSeeder::class,
            GuidesSeeder::class,
            WorkspaceSeeder::class,
            BookingsSeeder::class,
            ReviewsSeeder::class,
        ]);
        // User::factory(10)->create();

        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);
    }
}
