<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Student extends Model
{
    use HasFactory;

    protected $table = "students";
    protected $hidden = ['pivot'];

    protected $fillable = [
        'firstname',
        'surname',
        'username',
        'sex',
        'village',
        'traditional_authority',
        'district',
        'class'
    ];

    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class, 'role_student', 'student_id', 'role_id');
    }

    public function subjects(): BelongsToMany
    {
        return $this->belongsToMany(Subject::class, 'assessments')
            ->withPivot(['firstAssessment', 'secondAssessment', 'endOfTermAssessment', 'averageScore']);
    }

    public function level(): BelongsTo
    {
        return $this->belongsTo(Level::class, 'className');
    }

    public function assessments(): HasMany
    {
        return $this->hasMany(Assessment::class);
    }

    // Virtual attribute for full name
    public function getFullNameAttribute()
    {
        return "{$this->firstname} {$this->surname}";
    }

       /**
     * Define many-to-many relationship with subjects
     */

}
