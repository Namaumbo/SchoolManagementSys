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
        Schema::create('subjects', function (Blueprint $table) {
            $table->increments('id');
//            foreign
            $table->string('departmentName',)->nullable();
            $table->foreign('departmentName')
                ->references('departmentName')
                ->on('departments')
                ->onDelete('NO ACTION')
                ->onUpdate('CASCADE');

            $table->string('subject_name');
            $table->string('PeriodsPerWeek');
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
        Schema::dropIfExists('subjects');
    }
};
