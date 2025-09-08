<?php

namespace App\Services;

use App\Models\Music;
use App\Models\Notification;
use Illuminate\Support\Facades\Log;

class NotificationService
{
    /**
     * Create approval notification for music
     */
    public function createApprovalNotification(Music $music): void
    {
        $isApproved = $music->is_approved;
        $type = $isApproved ? 'approved' : 'rejected';

        $title = $isApproved
            ? '🎉 Música Aprovada!'
            : '❌ Música Reprovada';

        $message = $isApproved
            ? "Sua música '{$music->title}' foi aprovada e está disponível no Top 5!"
            : "Sua música '{$music->title}' foi reprovada. Que tal sugerir outra música?";

        try {
            Notification::create([
                'user_id' => $music->user_id,
                'music_id' => $music->id,
                'type' => $type,
                'title' => $title,
                'message' => $message,
            ]);

            Log::info('Notificação criada com sucesso', [
                'notification_type' => $type,
                'music_id' => $music->id,
                'user_id' => $music->user_id
            ]);
        } catch (\Exception $e) {
            Log::error('Erro ao criar notificação', [
                'error' => $e->getMessage(),
                'music_id' => $music->id,
                'user_id' => $music->user_id
            ]);
        }
    }

    /**
     * Create auto-approval notification for music
     */
    public function createAutoApprovalNotification(Music $music): void
    {
        try {
            Notification::create([
                'user_id' => $music->user_id,
                'music_id' => $music->id,
                'type' => 'auto_approved',
                'title' => '🚀 Música Auto-Aprovada!',
                'message' => "Sua música '{$music->title}' foi auto-aprovada após receber 5 contribuições e está disponível no Top 5!",
            ]);

            Log::info('Notificação de auto-aprovação criada com sucesso', [
                'music_id' => $music->id,
                'user_id' => $music->user_id
            ]);
        } catch (\Exception $e) {
            Log::error('Erro ao criar notificação de auto-aprovação', [
                'error' => $e->getMessage(),
                'music_id' => $music->id,
                'user_id' => $music->user_id
            ]);
        }
    }

    /**
     * Create rejection notification for music
     */
    public function createRejectionNotification(Music $music): void
    {
        try {
            Notification::create([
                'user_id' => $music->user_id,
                'music_id' => $music->id,
                'type' => 'rejected',
                'title' => '❌ Música Reprovada',
                'message' => "Sua música '{$music->title}' foi reprovada e removida. Que tal sugerir outra música?",
            ]);

            Log::info('Notificação de reprovação criada com sucesso', [
                'music_id' => $music->id,
                'user_id' => $music->user_id
            ]);
        } catch (\Exception $e) {
            Log::error('Erro ao criar notificação de reprovação', [
                'error' => $e->getMessage(),
                'music_id' => $music->id,
                'user_id' => $music->user_id
            ]);
        }
    }
}
