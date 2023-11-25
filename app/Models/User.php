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
        "district",
        "role_id"
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


   

    public function departments():\Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(
            Department::class,
            'users',
            'departmentName',
            'departmentName');
    }
// User.php

public function roles()
{
    return $this->belongsToMany(Role::class);
}



    public function subjects()
    {
        return $this->morphedByMany(
            Subject::class,
           'allocationable')->withTimeStamps();
    }

    public function levels()
    {
        return $this->morphedByMany(
            Level::class,
           'allocationable')->withTimeStamps();
    }

  
}
