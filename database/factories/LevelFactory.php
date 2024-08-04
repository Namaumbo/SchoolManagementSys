<?php

namespace Database\Factories;

use App\Models\Level;
use Illuminate\Database\Eloquent\Factories\Factory;

class LevelFactory extends Factory
{
    protected $model = Level::class;

    public function definition()
    {
        // Generate distinct class names
        static $className = 1;
        
        return [
            'className' => 'Form ' . $className++,
            'classTeacher' => $this->faker->name,
        ];
    }
}
