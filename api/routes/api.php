<?php

use App\Http\Controllers\ActivityLogController;
use App\Http\Controllers\MusicController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::get('musics/top-five', [MusicController::class, 'topFive']);
Route::get('musics/others', [MusicController::class, 'others']);
Route::get('musics', [MusicController::class, 'index']);

Route::middleware('auth:api')->group(function () {
    Route::resource('users', UserController::class);
    
    Route::get('musics/pending', [MusicController::class, 'pending']);
    Route::post('musics', [MusicController::class, 'store']);
    Route::post('musics/sync-youtube', [MusicController::class, 'syncFromYouTube']);
    Route::post('musics/{music}/approve', [MusicController::class, 'approve']);
    Route::post('musics/{music}/contribute', [MusicController::class, 'contribute']);
    Route::put('musics/{music}', [MusicController::class, 'update']);
    Route::delete('musics/{music}', [MusicController::class, 'destroy']);
    
    Route::middleware('admin')->group(function () {
        Route::get('activity-logs', [ActivityLogController::class, 'index']);
        Route::get('activity-logs/{activity}', [ActivityLogController::class, 'show']);
        Route::get('activity-logs/subject/{subjectType}/{subjectId}', [ActivityLogController::class, 'bySubject']);
        Route::get('activity-logs/user/{userId}', [ActivityLogController::class, 'byUser']);
    });
});

Route::get('musics/{music}', [MusicController::class, 'show']);
