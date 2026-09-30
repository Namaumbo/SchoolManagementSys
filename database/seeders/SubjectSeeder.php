<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class SubjectSeeder extends Seeder
{
    public function run()
    {
        $schools = \App\Models\SchoolInformation::all();
        if ($schools->isEmpty()) {
            $this->command?->error('School information not found. Please run SchoolInformationSeeder first.');
            return;
        }

        $subjects = [

            ['code' => 3, 'name' => 'Chichewa', 'periodsPerWeek' => 5],
            ['code' => 4, 'name' => 'Geography', 'periodsPerWeek' => 3],
            ['code' => 5, 'name' => 'History', 'periodsPerWeek' => 3],
            ['code' => 6, 'name' => 'Mathematics', 'periodsPerWeek' => 7],
            ['code' => 7, 'name' => 'Physics', 'periodsPerWeek' => 3],
            ['code' => 8, 'name' => 'Business Studies', 'periodsPerWeek' => 3],
            ['code' => 9, 'name' => 'Computer Studies', 'periodsPerWeek' => 3],
            ['code' => 10, 'name' => 'Agriculture', 'periodsPerWeek' => 3],
            ['code' => 11, 'name' => 'Chemistry', 'periodsPerWeek' => 3],

        ];

        foreach ($schools as $school) {
            foreach ($subjects as $subject) {
                \App\Models\Subject::firstOrCreate(
                    ['school_id' => $school->id, 'name' => $subject['name']],
                    [
                        'code' => $subject['code'],
                        'periodsPerWeek' => $subject['periodsPerWeek'],
                        'school_id' => $school->id,
                        'created_at' => Carbon::now(),
                        'updated_at' => Carbon::now(),
                    ]
                );
            }
        }
    }
}
