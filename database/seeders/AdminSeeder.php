<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Role;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'api']);

        $admin = User::firstOrCreate(
            ['email' => 'admin@tourpal.sy'],
            [
                'name' => 'TourPal Admin',
                'password_hash' => Hash::make('Admin@123456'),
            ]
        );

        if (!$admin->profile_photo) {
            $path = 'profile-photos/admin-tourpal.svg';
            Storage::disk('public')->makeDirectory('profile-photos');
            Storage::disk('public')->put(
                $path,
                '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><defs><linearGradient id="g" x1="0" x2="1"><stop offset="0%" stop-color="#0f766e"/><stop offset="100%" stop-color="#3b82f6"/></linearGradient></defs><rect width="400" height="400" rx="200" fill="#ecfeff"/><circle cx="200" cy="150" r="72" fill="url(#g)"/><circle cx="200" cy="320" r="120" fill="url(#g)"/><text x="200" y="205" text-anchor="middle" font-size="64" font-family="Arial" fill="#ffffff">A</text></svg>'
            );
            $admin->updateQuietly(['profile_photo' => $path]);
        }

        if (!$admin->hasRole('admin')) {
            $admin->assignRole('admin');
        }
    }
}
