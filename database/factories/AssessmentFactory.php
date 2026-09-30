<?php

namespace Database\Factories;

use App\Models\Assessment;
use App\Models\Student;
use App\Models\Subject;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class AssessmentFactory extends Factory
{
    protected $model = Assessment::class;

    public function definition()
    {
        return [
            'school_id' => null,
            'subject_id' => null,
            'student_id' => null,
            'schoolTerm' => $this->faker->randomElement(['Term 1', 'Term 2', 'Term 3']),
            'teacherEmail' => null,
            'firstAssessment' => $this->faker->randomFloat(2, 0, 100),
            'secondAssessment' => $this->faker->randomFloat(2, 0, 100),
            'endOfTermAssessment' => $this->faker->randomFloat(2, 0, 100),
            'averageScore' => 0,
            'created_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'updated_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
        ];
    }

    public function configure()
    {
        return $this->afterMaking(function (Assessment $assessment) {
            $student = $assessment->student_id
                ? Student::find($assessment->student_id)
                : Student::query()
                    ->when($assessment->school_id, function ($query) use ($assessment) {
                        $query->where('school_id', $assessment->school_id);
                    })
                    ->inRandomOrder()
                    ->first();

            if ($student) {
                $assessment->student_id = $student->id;
                $assessment->school_id = $assessment->school_id ?: $student->school_id;
            }

            if (!$assessment->subject_id) {
                $subject = Subject::query()
                    ->when($assessment->school_id, function ($query) use ($assessment) {
                        $query->where('school_id', $assessment->school_id);
                    })
                    ->inRandomOrder()
                    ->first();
                $assessment->subject_id = $subject?->id;
            }

            if (!$assessment->teacherEmail) {
                $teacher = User::query()
                    ->where('role_name', 'Teacher')
                    ->when($assessment->school_id, function ($query) use ($assessment) {
                        $query->where('school_id', $assessment->school_id);
                    })
                    ->inRandomOrder()
                    ->first();
                $assessment->teacherEmail = $teacher?->email;
            }
        });
    }
}
