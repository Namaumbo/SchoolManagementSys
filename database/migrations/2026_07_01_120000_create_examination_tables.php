<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('examination_settings', function (Blueprint $table) {
            $table->id();
            $table->string('academic_year')->default('2025/2026');
            $table->string('current_term')->default('term2');
            $table->boolean('first_assessment_enabled')->default(true);
            $table->boolean('second_assessment_enabled')->default(true);
            $table->boolean('end_of_term_enabled')->default(true);
            $table->timestamps();
        });

        Schema::create('grading_scales', function (Blueprint $table) {
            $table->id();
            $table->string('level', 20);
            $table->unsignedTinyInteger('min_score');
            $table->unsignedTinyInteger('max_score');
            $table->string('grade', 5);
            $table->string('analysis');
            $table->timestamps();

            $table->index(['level', 'min_score']);
        });

        $now = now();

        DB::table('examination_settings')->insert([
            'academic_year' => '2025/2026',
            'current_term' => 'term2',
            'first_assessment_enabled' => true,
            'second_assessment_enabled' => true,
            'end_of_term_enabled' => true,
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        $juniorGrades = [
            ['level' => 'junior', 'min_score' => 0, 'max_score' => 39, 'grade' => 'F', 'analysis' => 'Fail'],
            ['level' => 'junior', 'min_score' => 40, 'max_score' => 54, 'grade' => 'D', 'analysis' => 'Pass'],
            ['level' => 'junior', 'min_score' => 55, 'max_score' => 64, 'grade' => 'C', 'analysis' => 'Good'],
            ['level' => 'junior', 'min_score' => 65, 'max_score' => 74, 'grade' => 'B', 'analysis' => 'Very Good'],
            ['level' => 'junior', 'min_score' => 75, 'max_score' => 100, 'grade' => 'A', 'analysis' => 'Excellent'],
        ];

        $seniorGrades = [
            ['level' => 'senior', 'min_score' => 0, 'max_score' => 44, 'grade' => 'F', 'analysis' => 'Fail'],
            ['level' => 'senior', 'min_score' => 45, 'max_score' => 54, 'grade' => 'E', 'analysis' => 'Pass'],
            ['level' => 'senior', 'min_score' => 55, 'max_score' => 64, 'grade' => 'D', 'analysis' => 'Credit'],
            ['level' => 'senior', 'min_score' => 65, 'max_score' => 74, 'grade' => 'C', 'analysis' => 'Good'],
            ['level' => 'senior', 'min_score' => 75, 'max_score' => 84, 'grade' => 'B', 'analysis' => 'Very Good'],
            ['level' => 'senior', 'min_score' => 85, 'max_score' => 100, 'grade' => 'A', 'analysis' => 'Excellent'],
        ];

        foreach (array_merge($juniorGrades, $seniorGrades) as $grade) {
            DB::table('grading_scales')->insert(array_merge($grade, [
                'created_at' => $now,
                'updated_at' => $now,
            ]));
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('grading_scales');
        Schema::dropIfExists('examination_settings');
    }
};
