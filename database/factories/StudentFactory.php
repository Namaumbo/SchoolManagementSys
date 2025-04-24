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
        // Ensure we have at least 10 levels created before running StudentFactory
        Level::factory()->count(10)->create();

        // Get all available class names from levels
        $classNames = Level::pluck('className')->toArray();

        // Select a random class name from the available ones
        $className = $this->faker->randomElement($classNames);

        // Generate username based on class abbreviation
        $classNumber = preg_replace('/[^0-9]/', '', $className);
        $classAbbreviation = 'F' . $classNumber;
        $usernamePrefix = 'SIMS/' . $classAbbreviation . '/';
        $uniqueUsername = $this->faker->unique()->numerify($usernamePrefix . '###');

        return [
            'firstname' => $this->faker->firstName,
            'surname' => $this->faker->lastName,
            'className' => $className,
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
