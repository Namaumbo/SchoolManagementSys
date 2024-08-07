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
        'id',
        'name',
<<<<<<< HEAD
        'created_at',
        'updated_at',
        'description',

=======
        'code',
        'periodsPerWeek',
>>>>>>> SchoolPerformanceReport
    ];


    public function students(): BelongsToMany
    {
        return $this->belongsToMany(Student::class, 'assessments')
            ->withPivot(['firstAssessment', 'secondAssessment', 'endOfTermAssessment', 'averageScore']);
    }

    public function users()
    {
        return $this->belongsToMany(User::class)
            ->using(Allocationable::class)
            ->withPivot([
                'user_id', 'allocationable_id', 'allocationable_type', 'created_at',
                'updated_at', 'name', 'other_field1', 'other_field2'
            ]);

        return $this->morphedByMany(
            User::class,
            'allocationable'
        )->withTimeStamps()
            ->withPivot(['name']); // Include other columns from the assessments table

    }

    public function levels()
    {
        return $this->morphedByMany(
            Level::class,
           'allocationables')->withTimeStamps();
    }

    public function departments()
    {
        return $this->morphedByMany(
            Department::class,
           'allocationables')->withTimeStamps();
    }
}
