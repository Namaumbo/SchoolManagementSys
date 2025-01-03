<?php

use Illuminate\Database\Seeder;
use App\Models\Role;
use App\Models\User;
use App\Models\Subject;
use App\Models\Student;
use App\Models\Level;
use App\Models\Assessment;
use App\Services\AssessmentService;
use Faker\Generator as Faker;

class DatabaseSeeder extends Seeder
{
    protected $assessmentService;
    protected $faker;

    public function __construct(AssessmentService $assessmentService, Faker $faker)
    {
        $this->assessmentService = $assessmentService;
        $this->faker = $faker;
    }

    public function run()
    {
        // Seed roles
        Role::factory()->count(10)->create();

        // Seed users and associate roles
        User::factory()->count(300)->create();

        // Seed subjects
        Subject::factory()->count(12)->create();

        // Seed levels (classes) and attach subjects
        $levels = Level::factory()->count(10)->create();
        $subjects = Subject::all();

        $levels->each(function ($level) use ($subjects) {
            // Attach random subjects to each level
            $level->subjects()->attach($subjects->random());
        });

        // Seed students and associate levels
        Student::factory()->count(50)->create()->each(function ($student) use ($levels) {
            // Associate each student with a level (class)
            $student->update(['className' => $levels->random()->className]);
        });

        // Seed assessments
        Assessment::factory()->count(100)->create();

        // Update assessments using AssessmentService
        $this->updateAssessments();
    }

    protected function updateAssessments()
    {
        $assessments = Assessment::all();

        $assessments->each(function ($assessment) {
            $assessmentData = [
                'name' => $assessment->subject->name, // Assuming 'name' field exists in subject model
                'username' => $assessment->student->username, // Assuming 'username' field exists in student model
                'schoolTerm' => $this->faker->randomElement(['First Term', 'Second Term', 'Third Term']),
                'teacherEmail' => $this->faker->email,
                'firstAssessment' => $this->faker->randomFloat(2, 0, 100),
                'secondAssessment' => $this->faker->randomFloat(2, 0, 100),
                'endOfTermAssessment' => $this->faker->randomFloat(2, 0, 100),
                'averageScore' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ];

            $this->assessmentService->updateAssessment(new \Illuminate\Http\Request($assessmentData));
        });
    }
}
