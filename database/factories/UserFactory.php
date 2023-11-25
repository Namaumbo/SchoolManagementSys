<?php
namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

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
            'password' => bcrypt('password'), // You may use Hash::make('password') instead
            'sex' => $this->faker->randomElement(['male', 'female']),
            'village' => $this->faker->city,
            'traditional_authority' => $this->faker->word,
            'district' => $this->faker->city,
            'remember_token' => Str::random(10),
        ];
    }
}
