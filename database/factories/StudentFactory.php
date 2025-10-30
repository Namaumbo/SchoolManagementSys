<?php

namespace Database\Factories;

use App\Models\Student;
use App\Models\Level;
use Illuminate\Database\Eloquent\Factories\Factory;

class StudentFactory extends Factory
{
    protected $model = Student::class;

    public function definition()
    {
        // Pick a random existing level (assumes levels are seeded beforehand)
        $level = Level::inRandomOrder()->first();
        $className = $level ? $level->className : 'Form 1';

        // Generate username based on class abbreviation
        $classNumber = preg_replace('/[^0-9]/', '', $className);
        $classAbbreviation = 'F' . ($classNumber ?: '1');
        $usernamePrefix = 'SIMS/' . $classAbbreviation . '/';
        $uniqueUsername = $this->faker->unique()->numerify($usernamePrefix . '###');

        return [
            'firstname' => $this->faker->firstName,
            'surname' => $this->faker->lastName,
            'level_id' => $level ? $level->id : null,
            'sex' => $this->faker->randomElement(['male', 'female']),
            'village' => $this->faker->city,
            'traditional_authority' => $this->faker->state,
            'district' => $this->faker->state,
            'username' => $uniqueUsername, // Assign generated unique username
            'role_name' => $this->faker->randomElement(['Teacher', 'Head Of Department', 'Administrator']),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
