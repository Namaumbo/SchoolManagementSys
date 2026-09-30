<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    private array $tables = [
        'users',
        'students',
        'departments',
        'levels',
        'subjects',
        'assessments',
        'examination_settings',
        'grading_scales',
    ];

    public function up(): void
    {
        foreach ($this->tables as $table) {
            $this->addSchoolId($table);
        }

        $this->backfillSchoolIds();

        $this->scopeUniqueToSchool('subjects', 'name');
        $this->scopeUniqueToSchool('subjects', 'code');
        $this->scopeUniqueToSchool('levels', 'className');
        $this->scopeUniqueToSchool('departments', 'departmentName');

        if (Schema::hasColumn('departments', 'departmentCode')) {
            $this->scopeUniqueToSchool('departments', 'departmentCode');
        }

        $this->scopeUniqueToSchool('students', 'username');

        Schema::table('examination_settings', function (Blueprint $table) {
            $table->unique('school_id');
        });
    }

    public function down(): void
    {
        Schema::table('examination_settings', function (Blueprint $table) {
            $table->dropUnique(['school_id']);
        });

        $this->restoreSingleUnique('students', 'username');
        if (Schema::hasColumn('departments', 'departmentCode')) {
            $this->restoreSingleUnique('departments', 'departmentCode');
        }
        $this->restoreSingleUnique('departments', 'departmentName');
        $this->restoreSingleUnique('levels', 'className');
        $this->restoreSingleUnique('subjects', 'code');
        $this->restoreSingleUnique('subjects', 'name');

        foreach ($this->tables as $table) {
            if (!Schema::hasColumn($table, 'school_id')) {
                continue;
            }

            Schema::table($table, function (Blueprint $blueprint) {
                $blueprint->dropForeign(['school_id']);
                $blueprint->dropColumn('school_id');
            });
        }
    }

    private function addSchoolId(string $tableName): void
    {
        if (Schema::hasColumn($tableName, 'school_id')) {
            return;
        }

        Schema::table($tableName, function (Blueprint $table) {
            $table->unsignedInteger('school_id')->nullable();
            $table->foreign('school_id')
                ->references('id')
                ->on('school_information')
                ->onDelete('cascade');
            $table->index('school_id');
        });
    }

    private function backfillSchoolIds(): void
    {
        $hasRows = false;
        foreach ($this->tables as $table) {
            if (DB::table($table)->exists()) {
                $hasRows = true;
                break;
            }
        }

        $schoolId = DB::table('school_information')->orderBy('id')->value('id');

        if (!$schoolId && $hasRows) {
            $schoolId = DB::table('school_information')->insertGetId([
                'name' => 'Default School',
                'address' => 'Not set',
                'phone_number' => '00000000000',
                'logo_path' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        if (!$schoolId) {
            return;
        }

        foreach ($this->tables as $table) {
            DB::table($table)->whereNull('school_id')->update(['school_id' => $schoolId]);
        }
    }

    private function scopeUniqueToSchool(string $table, string $column): void
    {
        $this->dropSingleColumnUnique($table, $column);

        $indexName = $table . '_' . strtolower($column) . '_school_unique';
        Schema::table($table, function (Blueprint $blueprint) use ($column, $indexName) {
            $blueprint->unique(['school_id', $column], $indexName);
        });
    }

    private function restoreSingleUnique(string $table, string $column): void
    {
        $indexName = $table . '_' . strtolower($column) . '_school_unique';

        Schema::table($table, function (Blueprint $blueprint) use ($column, $indexName) {
            $blueprint->dropUnique($indexName);
            $blueprint->unique($column);
        });
    }

    private function dropSingleColumnUnique(string $table, string $column): void
    {
        $driver = Schema::getConnection()->getDriverName();

        if ($driver === 'pgsql') {
            $constraints = DB::select(
                "SELECT con.conname AS constraint_name
                 FROM pg_constraint con
                 JOIN pg_class rel ON rel.oid = con.conrelid
                 JOIN pg_namespace ns ON ns.oid = rel.relnamespace
                 JOIN pg_attribute att ON att.attrelid = rel.oid AND att.attnum = ANY (con.conkey)
                 WHERE ns.nspname = current_schema()
                   AND rel.relname = ?
                   AND con.contype = 'u'
                   AND cardinality(con.conkey) = 1
                   AND (att.attname = ? OR att.attname = ?)",
                [$table, $column, strtolower($column)]
            );

            foreach ($constraints as $constraint) {
                $name = str_replace('"', '""', $constraint->constraint_name);
                DB::statement('ALTER TABLE "' . $table . '" DROP CONSTRAINT IF EXISTS "' . $name . '"');
            }

            return;
        }

        try {
            Schema::table($table, function (Blueprint $blueprint) use ($column) {
                $blueprint->dropUnique([$column]);
            });
        } catch (\Throwable $e) {
            // The single-column unique index is already gone.
        }
    }
};
