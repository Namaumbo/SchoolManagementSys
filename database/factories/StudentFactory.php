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
        return [
            'firstname' => $this->faker->firstName,
            'surname' => $this->faker->lastName,
            'school_id' => null,
            'level_id' => null,
            'sex' => $this->faker->randomElement(['male', 'female']),
            'village' => $this->faker->city,
            'traditional_authority' => $this->faker->state,
            'district' => $this->faker->state,
            'username' => $this->faker->unique()->numerify('SIMS/F#/###'),
            'role_name' => 'Student',
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }

    public function configure()
    {
        return $this->afterMaking(function (Student $student) {
            $levelQuery = Level::query();
            if ($student->school_id) {
                $levelQuery->where('school_id', $student->school_id);
            }

            $level = $student->level_id
                ? Level::find($student->level_id)
                : $levelQuery->inRandomOrder()->first();

            if (!$level) {
                return;
            }

            $student->level_id = $level->id;
            $student->school_id = $student->school_id ?: $level->school_id;

            $classNumber = preg_replace('/[^0-9]/', '', (string) $level->className);
            $classAbbreviation = 'F' . ($classNumber ?: '1');
            $student->username = $this->faker->unique()->numerify('SIMS/' . $classAbbreviation . '/###');
        });
    }
}
