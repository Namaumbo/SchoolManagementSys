<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Subject>
 */
class SubjectFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        $subjects = [
            'Mathematics',
            'Biology',
            'Chichewa',
            'English',
            'Geography',
            'Physics',
            'Chemistry',
            'Computer'
        ];

        return [
            'name' => $this->faker->randomElement($subjects),
            'code' => strtoupper($this->faker->bothify('???###')), // e.g., 'ABC123'
            'periodsPerWeek' => $this->faker->numberBetween(1, 10),
        ];
    }
}
