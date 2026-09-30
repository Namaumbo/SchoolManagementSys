<?php

use Illuminate\Database\Seeder;
use App\Models\Role;
use App\Models\User;
use App\Models\Subject;
use App\Models\Student;
use App\Models\Level;
use App\Models\Assessment;
use App\Models\SchoolInformation;
use App\Services\AssessmentService;
use Database\Seeders\SchoolInformationSeeder;
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
        $this->call(SchoolInformationSeeder::class);

        // Seed roles (fixed set) - ensure uniqueness by primary key role_name
        Role::upsert([
            ['role_name' => 'Admin', 'created_at' => now(), 'updated_at' => now()],
            ['role_name' => 'Class Teacher', 'created_at' => now(), 'updated_at' => now()],
            ['role_name' => 'Teacher', 'created_at' => now(), 'updated_at' => now()],
            ['role_name' => 'Head Of Department', 'created_at' => now(), 'updated_at' => now()],
        ], ['role_name'], []);

        $schools = SchoolInformation::all();
        if ($schools->isEmpty()) {
            return;
        }

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

        $usersPerSchool = (int) ceil(300 / $schools->count());
        $studentsPerSchool = (int) ceil(50 / $schools->count());
        $assessmentsPerSchool = (int) ceil(100 / $schools->count());

        foreach ($schools as $school) {
            User::factory()->count($usersPerSchool)->create([
                'school_id' => $school->id,
            ]);

            foreach ($subjectsData as $subject) {
                Subject::updateOrCreate(
                    ['school_id' => $school->id, 'name' => $subject['name']],
                    [
                        'code' => $subject['code'],
                        'periodsPerWeek' => $subject['periodsPerWeek'],
                        'school_id' => $school->id,
                    ]
                );
            }

            foreach (['Form 1', 'Form 2', 'Form 3', 'Form 4'] as $className) {
                Level::updateOrCreate(
                    ['school_id' => $school->id, 'className' => $className],
                    [
                        'user_id' => null,
                        'school_id' => $school->id,
                    ]
                );
            }

            $levels = Level::where('school_id', $school->id)->get();
            $subjects = Subject::where('school_id', $school->id)->get();

            $levels->each(function ($level) use ($subjects) {
                if ($subjects->isEmpty()) {
                    return;
                }
                $level->subjects()->syncWithoutDetaching([$subjects->random()->id]);
            });

            Student::factory()->count($studentsPerSchool)->create([
                'school_id' => $school->id,
            ]);

            Assessment::factory()->count($assessmentsPerSchool)->create([
                'school_id' => $school->id,
            ]);
        }

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
