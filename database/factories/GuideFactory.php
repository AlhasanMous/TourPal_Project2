<?php

namespace Database\Factories;

use App\Models\Guide;
use App\Models\City;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class GuideFactory extends Factory
{
    protected $model = Guide::class;

    public function definition(): array
    {
        $city = City::inRandomOrder()->first();

        return [
            'user_id' => User::factory(),
            'city_id' => $city?->id ?? null,
            'verification_status' => $this->faker->randomElement(['pending', 'verified', 'rejected']),
            'specializations' => $this->faker->randomElements(['history', 'food', 'nature', 'architecture', 'religious'], 2),
            'availability' => [
                'monday' => ['08:00', '16:00'],
                'tuesday' => ['08:00', '16:00'],
            ],
        ];
    }
}
