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
        // Check if the column doesn't exist before adding it
        if (!Schema::hasColumn('departments', 'departmentCode')) {
            Schema::table('departments', function (Blueprint $table) {
                $table->string('departmentCode', 10)->unique()->after('departmentName');
            });

            // Update existing departments with default codes based on department name
            $departments = \App\Models\Department::all();
            foreach ($departments as $department) {
                $code = strtoupper(substr($department->departmentName, 0, 3)) . str_pad($department->id, 3, '0', STR_PAD_LEFT);
                $department->update(['departmentCode' => $code]);
            }
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('departments', function (Blueprint $table) {
            $table->dropColumn('departmentCode');
        });
    }
};
