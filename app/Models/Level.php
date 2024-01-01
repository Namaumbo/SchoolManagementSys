<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Level extends Model
{
    protected $table = "levels";

    protected $fillable = [
       
     'className',
     'classTeacher',
     'created_at',
     'update_at'
      
    ];

    public function users(){
        return $this->morphToMany(
            User::class,
            'allocationable');
    }

    public function student(): HasOne
    {
        return $this->hasOne(Student::class, 'class');
    }



 

 

}
