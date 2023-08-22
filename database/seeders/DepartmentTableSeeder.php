<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DepartmentTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('departments')->insert([
            [
                "departmentName" => "sciences",
                "headOfDepartment" =>"Milanzi",
                "description" => "deals with the science department"
            ],[
                "departmentName" => "languages",
                "headOfDepartment" =>"Mthumzi",
                "description" => "deals with the Language department"
          
            ],[
                "departmentName" => "Humanities",
                "headOfDepartment" =>"Noel",
                "description" => "deals with the Humanities department"
          

            ]

        ]);
    }
}
