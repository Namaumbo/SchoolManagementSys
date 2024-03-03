<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Subject extends Model
{
    use HasFactory;

    protected $table = "subjects";

    protected $fillable = [
        'name',
    ];

    public function students(): BelongsToMany
    {
        return $this->belongsToMany(Student::class, 'assessments')
            ->withPivot(['firstAssessment', 'secondAssessment', 'endOfTermAssessment', 'averageScore']);
    }



    public function users()
    {
        return $this->morphedByMany(
            User::class,
           'allocationable')->withTimeStamps()
           ->withPivot(['name']); // Include other columns from the assessments table

    }

    public function levels()
    {
        return $this->morphedByMany(
            Level::class,
           'allocationable')->withTimeStamps();
    }

    public function departments()
    {
        return $this->morphedByMany(
            Department::class,
           'allocationable')->withTimeStamps();
    }


}
