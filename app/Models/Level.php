<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\User;

class Level extends Model
{
    use HasFactory;

    protected $table = "levels";

    protected $fillable = [
        'className',
        'classTeacher'
    ];

    public function subjects(): \Illuminate\Database\Eloquent\Relations\MorphToMany
    {
        return $this->morphToMany(Subject::class, 'allocationable');
    }

    public function students(): HasMany
    {
        return $this->hasMany(Student::class, 'level_id', 'id');
    }

    // Kept as `users` to match existing controller/resource usage.
    public function users(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
