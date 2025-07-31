<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Assessment extends Model
{
    use HasFactory;

    protected $table = "assessments";
      
    protected $fillable = [
        'schoolTerm',
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

    public function student(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(
            Student::class,
            'assessments',
            'id',
            'student_id'
        );
    }

    public function subject(): \Illuminate\Database\Eloquent\Relations\BelongsTo
        {
            return $this->belongsTo(Subject::class);
        }
    
}
