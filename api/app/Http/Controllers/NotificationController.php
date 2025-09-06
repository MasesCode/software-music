<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class NotificationController extends Controller
{
    /**
     * Listar notificações do usuário autenticado
     */
    public function index(Request $request): JsonResponse
    {
        $user = auth()->user();
        $perPage = $request->get('per_page', 15);
        
        $notifications = $user->notifications()
            ->with('music')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return response()->json([
            'data' => $notifications->items(),
            'pagination' => [
                'current_page' => $notifications->currentPage(),
                'last_page' => $notifications->lastPage(),
                'per_page' => $notifications->perPage(),
                'total' => $notifications->total(),
            ],
            'unread_count' => $user->unreadNotificationsCount(),
        ], Response::HTTP_OK);
    }

    /**
     * Marcar notificação como lida
     */
    public function markAsRead(Notification $notification): JsonResponse
    {
        $this->authorize('update', $notification);
        
        $notification->markAsRead();

        return response()->json([
            'message' => 'Notification marked as read',
            'data' => $notification
        ], Response::HTTP_OK);
    }

    /**
     * Marcar todas as notificações como lidas
     */
    public function markAllAsRead(): JsonResponse
    {
        $user = auth()->user();
        
        $user->unreadNotifications()->update([
            'is_read' => true,
            'read_at' => now(),
        ]);

        return response()->json([
            'message' => 'All notifications marked as read',
        ], Response::HTTP_OK);
    }

    /**
     * Obter contagem de notificações não lidas
     */
    public function unreadCount(): JsonResponse
    {
        $user = auth()->user();
        
        return response()->json([
            'unread_count' => $user->unreadNotificationsCount(),
        ], Response::HTTP_OK);
    }

    /**
     * Deletar notificação
     */
    public function destroy(Notification $notification): JsonResponse
    {
        $this->authorize('delete', $notification);
        
        $notification->delete();

        return response()->json([
            'message' => 'Notification deleted',
        ], Response::HTTP_OK);
    }
}