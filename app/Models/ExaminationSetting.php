<?php

namespace App\Models;

use App\Traits\BelongsToSchool;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExaminationSetting extends Model
{
    use HasFactory, BelongsToSchool;

    protected $fillable = [
        'academic_year',
        'current_term',
        'first_assessment_enabled',
        'second_assessment_enabled',
        'end_of_term_enabled',
        'school_id',
    ];

    protected $casts = [
        'first_assessment_enabled' => 'boolean',
        'second_assessment_enabled' => 'boolean',
        'end_of_term_enabled' => 'boolean',
    ];
}
