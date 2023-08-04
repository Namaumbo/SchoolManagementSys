<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Relationship extends Model
{
    use HasFactory;
    protected $table = "relationships";
    protected $fillable=[

         'id',
         'student_id',
         'subject_id',
         'assessment_id'
       
        ];
      
    public function relationships():\Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(
            Subject::class,
            'relationships',
            'id',

            'subject_id');
    }

    public function students():\Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(
            Student::class,
            'relationships',
            'id',

            'student_id');
    }

   
  
    
 
}
