<?php

namespace App\Traits;

use App\Models\SchoolInformation;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

trait BelongsToSchool
{
    protected static function bootBelongsToSchool(): void
    {
        static::addGlobalScope('school', function (Builder $query) {
            if (auth()->check() && auth()->user()->school_id) {
                $query->where(
                    $query->getModel()->getTable() . '.school_id',
                    auth()->user()->school_id
                );
            }
        });

        static::creating(function (Model $model) {
            if (auth()->check() && !$model->school_id && auth()->user()->school_id) {
                $model->school_id = auth()->user()->school_id;
            }
        });
    }

    public function school(): BelongsTo
    {
        return $this->belongsTo(SchoolInformation::class, 'school_id');
    }
}
