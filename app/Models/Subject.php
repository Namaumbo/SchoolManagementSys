<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsToMany;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    use HasFactory;

    protected $table = "subjects";

    protected $fillable = [

        'id',
        'name',
        'created_at',
        'updated_at',
        'description',
        
    ];



    public function students(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(
            Student::class,
            'assessments'
        );
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class)
            ->using(Allocationable::class)
            ->withPivot(['user_id', 'allocationable_id', 'allocationable_type', 'created_at', 
            'updated_at', 'name', 'other_field1', 'other_field2']);
    }
}
