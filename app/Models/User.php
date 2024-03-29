<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

/**
 * @property mixed|string $password
 * @property mixed $surname
 * @method static find(int $id)
 * @method static where(string $string, int $id)
 */
class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;
    protected $table = "users";

    protected $fillable = [
        'title',
        'firstname',
        'surname',
        "email",
        "password",
        "sex",
        "village",
        "traditional_authority",
        "district"

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


    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class, 'role_name', 'role_name');
    }

 
    public function user(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(User::class);
    }



    public function classes():\Illuminate\Database\Eloquent\Relations\HasOne

    {
        return $this->hasOne(Level::class);
    }
        public function subjects(){
            return $this->morphToMany(
                Subject::class,
                'allocationables');
        }



    }

