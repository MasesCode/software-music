<?php

namespace App\Observers;

use App\Models\Music;
use App\Models\Notification;

class MusicNotificationObserver
{
    /**
     * Handle the Music "created" event.
     */
    public function created(Music $music): void
    {
        //
    }

    /**
     * Handle the Music "updated" event.
     */
    public function updated(Music $music): void
    {
        // Verificar se a música foi aprovada ou reprovada
        if ($music->wasChanged('is_approved')) {
            $this->createApprovalNotification($music);
        }
    }

    /**
     * Handle the Music "deleted" event.
     */
    public function deleted(Music $music): void
    {
        //
    }

    /**
     * Handle the Music "restored" event.
     */
    public function restored(Music $music): void
    {
        //
    }

    /**
     * Handle the Music "force deleted" event.
     */
    public function forceDeleted(Music $music): void
    {
        //
    }

    /**
     * Criar notificação de aprovação/reprovação
     */
    private function createApprovalNotification(Music $music): void
    {
        $type = $music->is_approved ? 'approved' : 'rejected';
        
        $title = $music->is_approved 
            ? '🎉 Música Aprovada!' 
            : '❌ Música Reprovada';
            
        $message = $music->is_approved
            ? "Sua música '{$music->title}' foi aprovada e está disponível no Top 5!"
            : "Sua música '{$music->title}' foi reprovada. Que tal sugerir outra música?";

        Notification::create([
            'user_id' => $music->user_id,
            'music_id' => $music->id,
            'type' => $type,
            'title' => $title,
            'message' => $message,
        ]);
    }

    /**
     * Criar notificação de auto-aprovação
     */
    public function createAutoApprovalNotification(Music $music): void
    {
        $title = '🚀 Música Auto-Aprovada!';
        $message = "Sua música '{$music->title}' foi auto-aprovada após receber 5 contribuições!";

        Notification::create([
            'user_id' => $music->user_id,
            'music_id' => $music->id,
            'type' => 'auto_approved',
            'title' => $title,
            'message' => $message,
        ]);
    }
}
