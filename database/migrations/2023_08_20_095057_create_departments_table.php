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
        Schema::create('departments', function (Blueprint $table) {
            $table->increments('id');
            $table->string('departmentName')->unique();
            $table->string('headofDepartment',50)->nullable()->unique();

            $table->text('description')->nullable(false);
            $table->timestamps();



            $table->foreign('headofDepartment')
            ->references('email')
            ->on('users')
            ->onDelete('NO ACTION')
            ->onUpdate('CASCADE');
 
        });
    }

    /**hpe the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('departments');
    }
};
