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
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->string('village');
            $table->string('traditional_authority');
            $table->string('district');
<<<<<<< HEAD

            $table->rememberToken();
            $table->timestamps();

      


=======
            $table->string('class');
            $table->string('role');
            $table->char('sex');
            $table->rememberToken();
            $table->timestamps();

>>>>>>> 1310ea3ababbda6a1159e9cb6478427a692df741
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
