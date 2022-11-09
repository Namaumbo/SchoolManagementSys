<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use HasFactory;
    protected $table='users';
    public $timestamps = true;
    protected $fillale=[
        'id',
        'firstname',
        'surname',
        'username',
        'village',
        'traditional_authority',
        'class',
        'location',
    ];
}
