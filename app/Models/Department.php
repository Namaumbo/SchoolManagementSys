<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @method static where(string $string, mixed $input)
 * @method static create(array $array)
 */
class Department extends Model
{
    use HasFactory;
    /**
     * @var \Carbon\Carbon|mixed

     */
    public mixed $created_at;
    public mixed $updated_at;

    protected $fillable = [
        'departmentName',
        'headOfDepartment',

    ];


   public function user(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(User::class);
    }
}
