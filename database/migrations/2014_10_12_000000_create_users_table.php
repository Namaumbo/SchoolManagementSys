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
        Schema::create('users', function (Blueprint $table) {
            $table->increments('id');
            $table->string('title');
            $table->string('firstname');
            $table->string('surname');
            $table->string('email')->unique();
            $table->string('sex');
            $table->string('password');
            $table->string('village');
            $table->string('district');
            $table->string('traditional_authority');
            $table->rememberToken();
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
        Schema::dropIfExists('users');
    }
};
