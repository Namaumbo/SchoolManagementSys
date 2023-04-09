<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Assessment extends Model
{
    use HasFactory;

    protected $fillable = [
        'firstAssessment',
        'secondAssessment',
        'endOfTermAssessment',
        'AverageScore',
        'created_at',
        'updated_at'
      
    ];
    public function subjects():\Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(
            Subject::class,
            'subjects',
            'id',
            'user_id');
    }

 
}
