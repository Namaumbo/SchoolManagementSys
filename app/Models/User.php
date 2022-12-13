<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

/**
 * @property mixed|string $password
 * @property mixed $surname
 */
class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    public mixed $village;
    public mixed $traditional_authority;
    public mixed $class;
    public mixed $district;
    /**
     * @var \Carbon\Carbon|mixed
     */
    public mixed $created_at;
    /**
     * @var \Carbon\Carbon|mixed
     */
    public mixed $updated_at;
    public mixed $email;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'title',
        'firstname',
        'surname',
        'email',
        'password',
        'village',
        'traditional_authority',
        'district',
        'created_at',
        'updated_at'
      
     
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    
}
