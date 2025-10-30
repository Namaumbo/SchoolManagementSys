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
        // Seed roles (fixed set) - ensure uniqueness by primary key role_name
        Role::upsert([
            ['role_name' => 'Admin', 'created_at' => now(), 'updated_at' => now()],
            ['role_name' => 'Class Teacher', 'created_at' => now(), 'updated_at' => now()],
            ['role_name' => 'Teacher', 'created_at' => now(), 'updated_at' => now()],
            ['role_name' => 'Head Of Department', 'created_at' => now(), 'updated_at' => now()],
        ], ['role_name'], []);

        // Seed users and associate roles
        User::factory()->count(300)->create();

        // Seed subjects (fixed unique list)
        $subjectsData = [
            ['name' => 'Mathematics', 'code' => 101, 'periodsPerWeek' => 8],
            ['name' => 'Biology', 'code' => 102, 'periodsPerWeek' => 6],
            ['name' => 'Chichewa', 'code' => 103, 'periodsPerWeek' => 6],
            ['name' => 'English', 'code' => 104, 'periodsPerWeek' => 8],
            ['name' => 'Geography', 'code' => 105, 'periodsPerWeek' => 5],
            ['name' => 'Physics', 'code' => 106, 'periodsPerWeek' => 6],
            ['name' => 'Chemistry', 'code' => 107, 'periodsPerWeek' => 6],
            ['name' => 'Computer', 'code' => 108, 'periodsPerWeek' => 5],
            ['name' => 'History', 'code' => 109, 'periodsPerWeek' => 5],
            ['name' => 'Agriculture', 'code' => 110, 'periodsPerWeek' => 5],
            ['name' => 'Civics', 'code' => 111, 'periodsPerWeek' => 4],
            ['name' => 'PE', 'code' => 112, 'periodsPerWeek' => 3],
        ];
        foreach ($subjectsData as &$s) { $s['created_at'] = now(); $s['updated_at'] = now(); }
        Subject::upsert($subjectsData, ['name', 'code'], ['periodsPerWeek', 'updated_at']);

        // Seed levels (classes) and attach subjects
        $levels = Level::factory()->count(4)->create();
        $subjects = Subject::all();

        $levels->each(function ($level) use ($subjects) {
            // Attach random subjects to each level
            $level->subjects()->attach($subjects->random());
        });

        // Seed students; factory assigns level_id
        Student::factory()->count(50)->create();

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
