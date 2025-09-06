<?php

namespace App\Providers;

use App\Models\Music;
use App\Models\User;
use App\Observers\MusicObserver;
use App\Observers\MusicNotificationObserver;
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
        
        // Apenas registrar o observer de notificações em produção
        if (!app()->environment('testing')) {
            Music::observe(MusicNotificationObserver::class);
        }
        
        // Configurar activity log
        Activity::saving(function (Activity $activity) {
            $activity->causer_id = auth()->id();
            $activity->causer_type = User::class;
        });
    }
}
