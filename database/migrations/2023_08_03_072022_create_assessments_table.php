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
            $table->integer('schoolTerm')->nullable();
            $table->string('subject_id',50)->nullable();
            $table->integer('user_id')->unsigned()->nullable();
            $table->string('student_id',50)->nullable();

            $table->integer('firstAssessment')->nullable();
            $table->integer('secondAssessment')->nullable();
            $table->integer('endOfTermAssessment')->nullable();
            $table->integer('averageScore')->nullable();

                $table->foreign('user_id')
                    ->references('id')
                    ->on('users')
                    ->onDelete('NO ACTION')
                    ->onUpdate('CASCADE');

                    $table->foreign('subject_id')
                    ->references('name')
                    ->on('subjects')
                    ->onDelete('NO ACTION')
                    ->onUpdate('CASCADE');
            
                    $table->foreign('student_id')
                    ->references('username')
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
