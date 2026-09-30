<?php

namespace App\Models;

use App\Traits\BelongsToSchool;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GradingScale extends Model
{
    use HasFactory, BelongsToSchool;

    protected $fillable = [
        'level',
        'min_score',
        'max_score',
        'grade',
        'analysis',
        'school_id',
    ];

    protected $casts = [
        'min_score' => 'integer',
        'max_score' => 'integer',
    ];
}
