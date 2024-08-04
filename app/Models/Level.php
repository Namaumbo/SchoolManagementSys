<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Level extends Model
{
    use HasFactory;

    protected $table = "levels";

    protected $fillable = [
        'className',
        'classTeacher'
    ];

    public function subjects(): \Illuminate\Database\Eloquent\Relations\MorphToMany
    {
        return $this->morphToMany(Subject::class, 'allocationable');
    }

    public function students(): HasMany
    {
        return $this->hasMany(Student::class, 'className', 'className');
    }
}
