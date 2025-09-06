<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Music;
use App\Models\Notification;

class NotificationSeeder extends Seeder
{
    public function run(): void
    {
        // Criar ou buscar usuário Miguel Antonio
        $user = User::firstOrCreate(
            ['email' => 'miguel.antonio@example.com'],
            [
                'name' => 'Miguel Antonio',
                'password' => bcrypt('password123'),
                'is_admin' => false
            ]
        );

        // Criar música de sugestão
        $music = Music::create([
            'title' => 'Pagode do Tião Carreiro - Clássico',
            'youtube_id' => 'dQw4w9WgXcQ',
            'thumb' => 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
            'user_id' => $user->id,
            'is_approved' => true,
            'count_to_approve' => 5,
            'suggestion_reason' => 'Música clássica do Tião Carreiro que todo mundo conhece!',
            'views' => 1250
        ]);

        // Criar notificação de aprovação
        $notification = Notification::create([
            'user_id' => $user->id,
            'music_id' => $music->id,
            'type' => 'approved',
            'title' => '🎉 Música Aprovada!',
            'message' => 'Sua música "Pagode do Tião Carreiro - Clássico" foi aprovada e está disponível no Top 5!',
            'is_read' => false
        ]);

        // Criar mais algumas notificações para testar
        $notification2 = Notification::create([
            'user_id' => $user->id,
            'music_id' => $music->id,
            'type' => 'auto_approved',
            'title' => '🚀 Música Auto-Aprovada!',
            'message' => 'Sua música "Pagode do Tião Carreiro - Clássico" foi auto-aprovada após receber 5 contribuições!',
            'is_read' => false
        ]);

        $this->command->info('Usuário criado: ' . $user->name . ' (ID: ' . $user->id . ')');
        $this->command->info('Música criada: ' . $music->title . ' (ID: ' . $music->id . ')');
        $this->command->info('Notificações criadas: 2');
    }
}
