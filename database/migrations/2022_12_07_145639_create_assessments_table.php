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
            $table->id();
            $table->integer('subject_id')->unsigned();
            $table->integer('user_id')->unsigned();

            $table->string('score');
            $table->timestamps();
            $table->foreign('subject_id')
            ->references('id')
            ->on('subjects')
            ->onDelete('CASCADE');


            $table->foreign('user_id')
            ->references('id')
            ->on('users')
            ->onDelete('CASCADE');
            
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
