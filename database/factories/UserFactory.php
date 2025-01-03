<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;

class UserFactory extends Factory
{
    protected $model = User::class;

    public function definition()
    {
        return [
            'title' => $this->faker->title,
            'firstname' => $this->faker->firstName,
            'surname' => $this->faker->lastName,
            'email' => $this->faker->unique()->safeEmail,
            'password' => Hash::make('password'), 
            'sex' => $this->faker->randomElement(['male', 'female']),
            'village' => $this->faker->city,
            'traditional_authority' => $this->faker->state,
            'district' => $this->faker->state,
            'remember_token' => Str::random(10),
            'role_name' => $this->faker->randomElement(['Teacher', 'Head Of Department', 'Admin','Class Teacher']),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
