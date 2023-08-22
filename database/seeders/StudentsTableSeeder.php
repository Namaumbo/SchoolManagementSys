<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class StudentsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('students')->insert([
            [
              
                "firstname"=>"Enock",
                "surname"=>"Chilombo",
                "username"=>"eno",
                "sex"=>"male",
                "village"=>"chilinde",
                "traditional_authority"=>"mayo",
                "district"=>"Lilongwe"
            ],
            [
                "firstname"=>"Emily",
                "surname"=>"mano",
                "username"=>"mano",
                "sex"=>"female",
                "village"=>"chilinde",
                "traditional_authority"=>"mayo",
                "district"=>"Lilongwe"
             
            ],
            [
                "firstname"=>"Jane",
                "surname"=>"Doe",
                "username"=>"oko",
                "sex"=>"female",
                "village"=>"chilinde",
                "traditional_authority"=>"mayo",
                "district"=>"Lilongwe"
             
            ],
            [
                "firstname"=>"Jams",
                "surname"=>"maan",
                "username"=>"man",
                "sex"=>"female",
                "village"=>"chilinde",
                "traditional_authority"=>"mayo",
                "district"=>"Lilongwe"
             
            ],

          
            // Add more data as needed
        ]);
    }
}
