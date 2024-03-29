<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use HasFactory;
    protected $table = "students";
    protected $fillable=[
        
        'firstname',
        'surname',
        "username",
        "sex",
        "village",
        "traditional_authority",
        "district",
        "class"
       

    ];
    
  

    public function roles():\Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(
            Role::class,
            'students',
            'id',
            'role_name');
    }
 
    public function subjects():\Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(Subject::class, 'assessments' )
        ->withPivot(['firstAssessment','secondAssessment','endOfTermAssessment','averageScore']); // Include other columns from the assessments table

    }


    public function levels(): BelongsTo
    {
        return $this->belongsTo(Level::class, 'class');
    }
    
    public function assessments()
    {
        return $this->hasMany(Assessment::class);
    }
   

}
  

