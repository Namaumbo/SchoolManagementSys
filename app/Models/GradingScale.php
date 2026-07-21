<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GradingScale extends Model
{
    use HasFactory;

    protected $fillable = [
        'level',
        'min_score',
        'max_score',
        'grade',
        'analysis',
    ];

    protected $casts = [
        'min_score' => 'integer',
        'max_score' => 'integer',
    ];
}
