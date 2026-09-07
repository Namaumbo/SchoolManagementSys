<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Assessment extends Model
{
    use HasFactory;

    protected $table = "assessments";
      
    protected $fillable = [
        'schoolTerm',
        'teacherEmail',
        'subject_id',
        'firstAssessment',
        'secondAssessment',
        'endOfTermAssessment', 
        'averageScore',
        'user_id',
        'student_id',
    ];

    protected $casts = [
        'endOfTermAssessment' => 'double', 
    ];

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class, 'student_id');
    }

    public function subject(): BelongsTo
    {
        return $this->belongsTo(Subject::class, 'subject_id');
    }
}
