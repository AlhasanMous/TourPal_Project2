<?php

namespace Database\Factories;

use App\Models\GuideBooking;
use App\Models\Guide;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class GuideBookingFactory extends Factory
{
    protected $model = GuideBooking::class;

    public function definition(): array
    {
        $guide = Guide::inRandomOrder()->first();
        $tourist = User::inRandomOrder()->first();

        return [
            'tourist_user_id' => $tourist?->id ?? User::factory(),
            'guide_id' => $guide?->id ?? Guide::factory(),
            'booking_date' => $this->faker->dateTimeBetween('-1 month', '+1 month')->format('Y-m-d'),
            'start_time' => '09:00',
            'end_time' => '12:00',
            'status' => $this->faker->randomElement(['pending', 'confirmed', 'cancelled']),
            'workspace_id' => null,
        ];
    }
}
