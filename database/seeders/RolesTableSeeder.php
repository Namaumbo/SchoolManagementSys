<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RolesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('roles')->insert([
            ['role_name'=>"Administrator"],
            ['role_name'=>"Student"],
            ['role_name'=>"Head teacher"],
            ['role_name'=>"Teacher"]

        ]);
    }
}
