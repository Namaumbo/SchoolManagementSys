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
        Schema::create('allocationables', function (Blueprint $table) {
            $table->increments('id');


            $table->unsignedInteger('user_id')->nullable();
     
            $table->morphs('allocationable');

            $table->foreign('user_id')
            ->references('id')
            ->on('users')
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
        Schema::dropIfExists('allocations');
    }
};
