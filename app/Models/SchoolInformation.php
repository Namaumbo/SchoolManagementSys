<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SchoolInformation extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'address',
        'phone_number',
        'logo_path',
    ];

    protected $dates = [
        'created_at',
        'updated_at',
    ];

    public function users(): HasMany
    {
        return $this->hasMany(User::class, 'school_id');
    }

    public function students(): HasMany
    {
        return $this->hasMany(Student::class, 'school_id');
    }

    public function departments(): HasMany
    {
        return $this->hasMany(Department::class, 'school_id');
    }

    public function levels(): HasMany
    {
        return $this->hasMany(Level::class, 'school_id');
    }

    public function subjects(): HasMany
    {
        return $this->hasMany(Subject::class, 'school_id');
    }

    public function assessments(): HasMany
    {
        return $this->hasMany(Assessment::class, 'school_id');
    }

    public function examinationSettings(): HasMany
    {
        return $this->hasMany(ExaminationSetting::class, 'school_id');
    }

    public function gradingScales(): HasMany
    {
        return $this->hasMany(GradingScale::class, 'school_id');
    }
}
