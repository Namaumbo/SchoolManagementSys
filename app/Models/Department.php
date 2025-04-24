<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Department extends Model
{
    use HasFactory;

    // Define the fillable properties
    protected $fillable = [
        'departmentName',
        'head_of_department_id',
        'description',
    ];

    // Define the relationship with the head of the department (a single user)
    public function headOfDepartment()
    {
        return $this->belongsTo(User::class, 'head_of_department_id');
    }

    // Define the many-to-many relationship with users
    public function users()
    {
        return $this->belongsToMany(User::class);
    }
}
