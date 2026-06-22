<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('level_user', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('level_id');
            $table->unsignedInteger('user_id');
            $table->timestamps();

            $table->unique(['level_id', 'user_id']);

            $table->foreign('level_id')
                ->references('id')
                ->on('levels')
                ->onDelete('CASCADE');

            $table->foreign('user_id')
                ->references('id')
                ->on('users')
                ->onDelete('CASCADE');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('level_user');
    }
};
