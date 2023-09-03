<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    use HasFactory;

    protected $table = "subjects";
      
      protected $fillable=[

      'id',
      'name',
      'created_at',
      'updated_at'
    
      ];
    
    
   
    public function students():BelongsToMany
    {
        return $this->belongsToMany(
            Student::class,
           'assessments');
           //pivot table is assessment table
    }

    public function users()
    {
        return $this->morphToMany(
            User::class,
            'allocationable');
    }
   
    
          }

