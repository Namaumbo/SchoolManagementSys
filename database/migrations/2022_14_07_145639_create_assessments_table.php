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
            $table->integer('firstAssessment');
            $table->integer('secondAssessment');
            $table->integer('endOfTermAssessment');
            $table->integer('average_Score')->nullable();

            $table->integer('subject_id')->unsigned();
            $table->foreign('subject_id')
            ->references('id')
            ->on('subjects')
            ->onDelete('CASCADE');

            $table->integer('user_id')->unsigned();
            $table->foreign('user_id')
            ->references('id')
            ->on('users')
            ->onDelete('CASCADE');

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
