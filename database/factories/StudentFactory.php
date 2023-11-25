<?php

namespace Database\Factories;
use App\Models\Student;
use App\Models\Level;
use Illuminate\Database\Eloquent\Factories\Factory;
use Faker\Generator as Faker;

class StudentFactory extends Factory
{
    protected $model = Student::class;

    public function definition()
    {
        return [
            'firstname' => $this->faker->firstName,
            'surname' => $this->faker->lastName,
            'username' => $this->faker->unique()->userName, // Set as unique
            'sex' => $this->faker->randomElement(['male', 'female']),
            'village' => $this->faker->word,
            'traditional_authority' => $this->faker->word,
            'district' => $this->faker->word,
            'updated_at' => now(),
            'created_at' => now(),
        ];
    }
}
