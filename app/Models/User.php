<?php

namespace App\Models;

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
        'email',
        'password',
        'sex',
        'village',
        'traditional_authority',
        'district'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function role()
    {
        return $this->belongsTo(Role::class, 'role_name', 'role_name');
    }

  

    public function subjects()
    {
        return $this->morphToMany(Subject::class, 'allocationable');
    }

    public function departments()
    {
        return $this->belongsToMany(Department::class);
    }

    public function departmentHead()
    {
        return $this->hasOne(Department::class, 'head_of_department_id');
    }

}
