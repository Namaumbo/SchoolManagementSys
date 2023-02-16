<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    use HasFactory;

    public mixed $departmentName;
    public mixed $headOfDepartment;
    /**
     * @var \Carbon\Carbon|mixed
     */
    public mixed $created_at;
    public mixed $updated_at;

    protected $fillable = [
        'departmentName',
        'headOfDepartment',
        'created_at',
        'updated_at'

    ];

   public function user(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(User::class);
    }
}
