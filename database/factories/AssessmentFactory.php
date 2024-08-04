<?php

namespace Database\Factories;

use App\Models\Assessment;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class AssessmentFactory extends Factory
{
    protected $model = Assessment::class;

    public function definition()
    {
        $teacherEmail = User::where('role_name', 'Teacher')->inRandomOrder()->first()->email;

        return [
            'subject_id' => \App\Models\Subject::factory(),
            'student_id' => \App\Models\Student::factory(),
            'schoolTerm' => $this->faker->randomElement(['Term 1', 'Term 2', 'Term 3']),
            'teacherEmail' => $teacherEmail,
            'firstAssessment' => $this->faker->randomFloat(2, 0, 100),
            'secondAssessment' => $this->faker->randomFloat(2, 0, 100),
            'endOfTermAssessment' => $this->faker->randomFloat(2, 0, 100),
            'averageScore' => 0,
            'created_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'updated_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
        ];
    }
}
