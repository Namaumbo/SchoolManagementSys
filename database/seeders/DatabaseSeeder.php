<?php

use Illuminate\Database\Seeder;
use App\Models\Role;
use App\Models\User;
use App\Models\Subject;
use App\Models\Student;
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
        $roles = Role::factory()->count(6)->create();

        // Seed users and associated roles
        $users = User::factory()->count(60)->create();
        $users->each(function ($user) use ($roles) {
            $user->roles()->attach($roles->random());
        });

        // Seed subjects
        $subjects = Subject::factory()->count(12)->create();

        // Seed students and attach subjects
        $students = Student::factory()
            ->count(50)
            ->create()
            ->each(function ($student) use ($subjects) {
                // Attach random subjects to each student
                $student->subjects()->attach($subjects->random());
            });

        // Update assessments using AssessmentService
        foreach (range(1, 100) as $index) {
            $subject = $subjects->random();
            $student = $students->random();

            $assessmentData = [
                'name' => $subject->name, // Use the actual field name
                'username' => $student->username, // Use the actual field name
                'schoolTerm' => $this->faker->randomElement(['First Term', 'Second Term', 'Third Term']),
                'teacherEmail' => $this->faker->email,
                'firstAssessment' => $this->faker->randomFloat(2, 0, 100),
                'secondAssessment' => $this->faker->randomFloat(2, 0, 100),
                'endOfTermAssessment' => $this->faker->randomFloat(2, 0, 100),
                'averageScore' => 0,
                'created_at' => now(),
                'updated_at' => now()
            ];

            $this->assessmentService->updateAssessment(new \Illuminate\Http\Request($assessmentData));
        }
    }
}
