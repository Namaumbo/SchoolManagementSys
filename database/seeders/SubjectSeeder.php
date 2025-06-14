<?php

namespace Database\Seeders;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class SubjectSeeder extends Seeder
{
    public function run()
    {
        $subjects = [
  
            ['code' => 3, 'name' => 'Chichewa', 'periodsPerWeek' => 5],
            ['code' => 4, 'name' => 'Geography', 'periodsPerWeek' => 3],
            ['code' => 5, 'name' => 'History', 'periodsPerWeek' => 3],
            ['code' => 6, 'name' => 'Mathematics', 'periodsPerWeek' => 7],
            ['code' => 7, 'name' => 'Physics', 'periodsPerWeek' => 3],
            ['code' => 8, 'name' => 'Business Studies', 'periodsPerWeek' => 3],
            ['code' => 9, 'name' => 'Computer Studies', 'periodsPerWeek' => 3],
            ['code' => 10, 'name' => 'Agriculture', 'periodsPerWeek' => 3],
            ['code' =>11, 'name' => 'Chemistry', 'periodsPerWeek' => 3],

        ];
        foreach ($subjects as $subject) {
            DB::table('subjects')->insert([
                'code' => $subject['code'],
                'name' => $subject['name'],
                'periodsPerWeek' => $subject['periodsPerWeek'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]);
        }
    }
}
