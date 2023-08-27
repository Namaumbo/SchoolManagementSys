<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Student>
 */
class StudentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'firstname' => fake()->firstname(),
            'surname' => fake()->surname(),
            'username' => fake()->username(),
            'sex' => fake()->sex(),
            'village' => fake()->village(),
            'district' => fake()->district(),
            'traditional_authority' => fake()->traditional_authority(),

            'remember_token' => Str::random(10),
        ];
    }
}
