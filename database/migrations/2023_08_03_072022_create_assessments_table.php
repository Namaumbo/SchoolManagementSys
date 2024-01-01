<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('assessments', function (Blueprint $table) {
            $table->increments('id');
            $table->string('schoolTerm',50)->nullable();
            $table->string('teacherEmail',50)->nullable();
            $table->unsignedInteger('subject_id')->nullable();
            $table->unsignedInteger('student_id')->nullable();

            $table->integer('firstAssessment')->nullable();
            $table->integer('secondAssessment')->nullable();
            $table->integer('endOfTermAssessment')->nullable();
            $table->integer('averageScore')->nullable();

                $table->foreign('teacherEmail')
                    ->references('email')
                    ->on('users')
                    ->onDelete('NO ACTION')
                    ->onUpdate('CASCADE');

                    $table->foreign('student_id')
                        ->references('id')
                        ->on('students')
                        ->onDelete('NO ACTION')
                        ->onUpdate('CASCADE');


        
                        $table->foreign('subject_id')
                            ->references('id')
                            ->on('subjects')
                            ->onDelete('NO ACTION')
                            ->onUpdate('CASCADE');
            $table->timestamps();

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('assessments');
    }
};
