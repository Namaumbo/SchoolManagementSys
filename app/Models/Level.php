<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Level extends Model
{
    use HasFactory;

    protected $table = "levels";

    protected $fillable = [
        'className',
        'user_id',
        'created_at',
        'updated_at'
    ];

    public function subjects()
    {
        return $this->morphToMany(Subject::class, 'allocationable');
    }

    public function students()
    {
        return $this->hasMany(Student::class, 'level_id');
    }

    public function classTeacher()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
