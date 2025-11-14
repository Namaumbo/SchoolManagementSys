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
        Schema::table('students', function (Blueprint $table) {
            if (Schema::hasColumn('students', 'className')) {
                // Drop foreign key constraint first if it exists
                try {
                    $table->dropForeign(['className']);
                } catch (\Throwable $e) {
                    // ignore if no FK
                }
                $table->dropColumn('className');
            }
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('students', function (Blueprint $table) {
            if (!Schema::hasColumn('students', 'className')) {
                $table->string('className', 50)->nullable();
                // Note: re-adding FK requires levels.className to exist and be unique
                try {
                    $table->foreign('className')
                        ->references('className')
                        ->on('levels')
                        ->onDelete('NO ACTION')
                        ->onUpdate('CASCADE');
                } catch (\Throwable $e) {
                    // ignore if cannot add FK in down migration
                }
            }
        });
    }
};
