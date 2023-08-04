<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Assessment extends Model
{
    use HasFactory;




    protected $table = "assessments";
      
      protected $fillable=[

       'schoolTerm',
       'subject_id',
       'firstAssessment',
       'secondAssessment',
       'endOfTermAssessment',
       'averageScore',
       'user_id'
      
      ];
      public function students()
      {
          return $this->belongsTo(Student::class);
      }

}