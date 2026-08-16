<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\AdminSeeder;
use Database\Seeders\RoleSeeder;
use Database\Seeders\UsersSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class UserSeederProfilePhotoTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_seeders_assign_profile_photo_paths(): void
    {
        Storage::fake('public');

        $this->seed(RoleSeeder::class);
        $this->seed(AdminSeeder::class);
        $this->seed(UsersSeeder::class);

        $user = User::query()->where('email', 'admin@tourpal.sy')->first();
        $this->assertNotNull($user?->profile_photo);
        $this->assertTrue(Storage::disk('public')->exists($user->profile_photo));

        $this->assertTrue(
            User::query()->whereNotNull('profile_photo')->exists()
        );
    }
}
