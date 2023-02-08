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
        'score',
        'created_at',
        'updated_at'
      
    ];

 
}
