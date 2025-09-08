<?php

namespace App\Providers;

use App\Models\Music;
use App\Models\User;
use App\Observers\MusicObserver;
use Illuminate\Support\ServiceProvider;
use Spatie\Activitylog\Models\Activity;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        Music::observe(MusicObserver::class);
        
        Activity::saving(function (Activity $activity) {
            $activity->causer_id = auth()->id();
            $activity->causer_type = User::class;
        });
    }
}
