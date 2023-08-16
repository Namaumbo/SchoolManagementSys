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
        Schema::create('students', function (Blueprint $table) {

            $table->string('id')->primary()->autoIncrement();
            $table->string('firstname');
            $table->string('surname');
            $table->string('username')->unique();
            $table->string('sex');
            $table->string('village');
            $table->string('traditional_authority');
            $table->string('district');
            $table->string('class')->nullable();


            $table->string('role_name',50)->nullable();
            $table->foreign('role_name')
                ->references('role_name')
                ->on('roles')
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
        Schema::dropIfExists('students');
    }
};
