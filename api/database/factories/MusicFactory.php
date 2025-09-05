<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class MusicFactory extends Factory
{
    public function definition(): array
    {
        return [
            'title' => $this->faker->sentence(3),
            'views' => $this->faker->numberBetween(1000, 10000000),
            'youtube_id' => $this->faker->regexify('[a-zA-Z0-9_-]{11}'),
            'thumb' => 'https://img.youtube.com/vi/' . $this->faker->regexify('[a-zA-Z0-9_-]{11}') . '/hqdefault.jpg',
            'user_id' => User::factory(),
            'is_approved' => $this->faker->boolean(80),
            'count_to_approve' => $this->faker->numberBetween(0, 5),
            'suggestion_reason' => $this->faker->optional()->sentence(),
        ];
    }

    public function approved(): static
    {
        return $this->state(fn(array $attributes) => [
            'is_approved' => true,
            'count_to_approve' => 0,
        ]);
    }

    public function pending(): static
    {
        return $this->state(fn(array $attributes) => [
            'is_approved' => false,
            'count_to_approve' => $this->faker->numberBetween(0, 4),
        ]);
    }
}
