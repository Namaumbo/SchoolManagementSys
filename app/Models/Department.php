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
        'departmentCode',
        'head_of_department_id',
        'description',
    ];

    // Model events
    protected static function booted()
    {
        // Hook that runs after a department is created
        static::created(function ($department) {
            if ($department->head_of_department_id) {
                User::where('id', $department->head_of_department_id)
                    ->update(['is_in_department' => true]);
            }
        });

        // Hook that runs after a department is updated but not used yet 
        // static::updated(function ($department) {
        //     if ($department->wasChanged('head_of_department_id')) {
        //         $oldHeadId = $department->getOriginal('head_of_department_id');
        //         $newHeadId = $department->head_of_department_id;

        //         if ($oldHeadId) {
        //             User::where('id', $oldHeadId)
        //                 ->update(['is_in_department' => false]);
        //         }

        //         if ($newHeadId) {
        //             User::where('id', $newHeadId)
        //                 ->update(['is_in_department' => true]);
        //         }
        //     }
        // });

        // Hook that runs after a department is deleted
        static::deleted(function ($department) {
            if ($department->head_of_department_id) {
                User::where('id', $department->head_of_department_id)
                    ->update(['is_in_department' => false]);
            }
        });
    }

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
