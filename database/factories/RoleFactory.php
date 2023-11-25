<?php

namespace Database\Factories;

use App\Models\Role;
use Illuminate\Database\Eloquent\Factories\Factory;

class RoleFactory extends Factory
{
    protected $model = Role::class;

    public function definition()
    {
        return [
            'role_name' => $this->faker->randomElement(['Admin', 'Teacher','HeadTeacher','Head Of Department','Principal','Deputy Headteacher']),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}

