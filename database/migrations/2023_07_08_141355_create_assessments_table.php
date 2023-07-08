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
            $table->integer('schoolTerm')->unique();
            $table->integer('firstAssessment');
            $table->integer('secondAssessment');
            $table->integer('endOfTermAssessment');
            $table->integer('averageScore')->nullable();

            $table->integer('subject_id')->unsigned()->nullable();
            $table->foreign('subject_id')
            ->references('id')
            ->on('subjects')
            ->onDelete('NO ACTION')
            ->onUpdate('CASCADE');

            $table->integer('user_id')->unsigned()->nullable();
            $table->foreign('user_id')
            ->references('id')
            ->on('users')
            ->onDelete('NO ACTION')
              ->onUpdate('CASCADE');

              $table->unsignedInteger('student_id');
              $table->foreign('student_id')
              ->references('id')
              ->on('students')
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
