<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->name();
        $path = 'profile-photos/' . Str::slug($name) . '-' . random_int(100, 9999) . '.svg';

        Storage::disk('public')->makeDirectory('profile-photos');
        Storage::disk('public')->put(
            $path,
            '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><defs><linearGradient id="g" x1="0" x2="1"><stop offset="0%" stop-color="#2563eb"/><stop offset="100%" stop-color="#7c3aed"/></linearGradient></defs><rect width="400" height="400" rx="200" fill="#e2e8f0"/><circle cx="200" cy="150" r="72" fill="url(#g)"/><circle cx="200" cy="320" r="120" fill="url(#g)"/><text x="200" y="205" text-anchor="middle" font-size="64" font-family="Arial" fill="#ffffff">' . strtoupper(substr($name, 0, 1)) . '</text></svg>'
        );

        return [
            'name'                => $name,
            'email'               => fake()->unique()->safeEmail(),
            'email_verified_at'   => now(),
            'password_hash'       => Hash::make('password'),
            'profile_photo'       => $path,
            'languages'           => ['Arabic'],
            'is_matching_enabled' => true,
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn(array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
