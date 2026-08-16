<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\NotificationSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class NotificationSeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_notification_seeder_creates_records_for_existing_users(): void
    {
        User::factory()->count(3)->create();

        (new NotificationSeeder())->run();

        $this->assertDatabaseCount('notifications', 20);
    }
}
