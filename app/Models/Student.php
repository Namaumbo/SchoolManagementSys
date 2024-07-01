<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use HasFactory;

    protected $table = "students";

    protected $fillable = [
        'firstname',
        'surname',
        'username',
        'sex',
        'village',
        'traditional_authority',
        'district',
        'level_id'
    ];

    public function roles()
    {
        return $this->belongsToMany(Role::class, 'student_role', 'student_id', 'role_id');
    }

    public function subjects()
    {
        return $this->belongsToMany(Subject::class, 'assessments')
            ->withPivot(['firstAssessment', 'secondAssessment', 'endOfTermAssessment', 'averageScore']);
    }

    public function level()
    {
        return $this->belongsTo(Level::class, 'level_id');
    }

    public function assessments()
    {
        return $this->hasMany(Assessment::class);
    }
}
