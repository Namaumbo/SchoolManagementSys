<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Level extends Model
{
    protected $table = "levels";

    protected $fillable = [
        'className',
        'subject_id',
        'user_id',
     
      
    ];

 
    public function subjects():\Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(
            Subject::class,
            'levels',
            'id',
            'subject_id');
    }


 
    public function users():\Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(
                User::class,
            'levels',
            'id',
            'user_id');
    }

 

}
