<?php

namespace Database\Factories;

use App\Models\Review;
use App\Models\User;
use App\Models\Place;
use App\Models\Guide;
use Illuminate\Database\Eloquent\Factories\Factory;

class ReviewFactory extends Factory
{
    protected $model = Review::class;

    public function definition(): array
    {
        $reviewableType = $this->faker->randomElement([Place::class, Guide::class]);
        $reviewable = $reviewableType::inRandomOrder()->first();

        return [
            'reviewer_user_id' => User::inRandomOrder()->first()?->id ?? User::factory(),
            'reviewable_type' => $reviewableType,
            'reviewable_id' => $reviewable?->id ?? null,
            'rating' => $this->faker->numberBetween(3, 5),
            'content' => $this->faker->sentence(),
        ];
    }
}
