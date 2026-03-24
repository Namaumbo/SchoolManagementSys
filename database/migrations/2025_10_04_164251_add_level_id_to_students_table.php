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
            // Add nullable first to allow backfill without DBAL change()
            if (!Schema::hasColumn('students', 'level_id')) {
                $table->unsignedInteger('level_id')->nullable()->after('district');
                $table->index('level_id');
            }
        });

        // Backfill level_id from existing className by matching to levels.className
        \Illuminate\Support\Facades\DB::statement('UPDATE students s SET level_id = l.id FROM levels l WHERE s."className" = l."className"');

        // Add foreign key (and keep nullable for now to avoid failures)
        Schema::table('students', function (Blueprint $table) {
            $table->foreign('level_id')->references('id')->on('levels')->onDelete('set null');
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
            if (Schema::hasColumn('students', 'level_id')) {
                $table->dropForeign(['level_id']);
                $table->dropIndex(['level_id']);
                $table->dropColumn('level_id');
            }
        });
    }
};
