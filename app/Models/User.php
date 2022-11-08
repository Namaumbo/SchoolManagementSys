<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
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
