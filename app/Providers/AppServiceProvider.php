<?php

namespace App\Providers;
use Illuminate\Database\Eloquent\Relations\Relation;


use Illuminate\Support\ServiceProvider;
use Illuminate\Http\Resources\Json\JsonResource;
class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        Relation::morphMap([
            'Level'=>'App\Models\Level',
            'Subject'=>'App\Models\Subject',
        ]);
  
        JsonResource::withoutWrapping();

    }
}
