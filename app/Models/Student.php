<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use HasFactory;
    protected $table=' Students';
    public $timestamps = true;
    protected $fillale=[
        'id',
        'firstname',
        'surname',
        'village',
        't/a',
        'class',
        'location',
    ];
}
