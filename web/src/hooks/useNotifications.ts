import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Notification, NotificationResponse } from '@/types';

export const useNotifications = () => {
  const [unreadCount, setUnreadCount] = useState(0);

  // Buscar notificações
  const {
    data: notificationsData,
    isLoading,
    error,
    refetch,
  } = useQuery<NotificationResponse>({
    queryKey: ['notifications'],
    queryFn: async () => {
      const response = await api.get<NotificationResponse>('/notifications');
      return response.data;
    },
    refetchInterval: 30000, // Refetch a cada 30 segundos
  });

  // Buscar contagem de não lidas
  const { data: unreadCountData } = useQuery<{ unread_count: number }>({
    queryKey: ['notifications-unread-count'],
    queryFn: async () => {
      const response = await api.get<{ unread_count: number }>('/notifications/unread-count');
      return response.data;
    },
    refetchInterval: 10000, // Refetch a cada 10 segundos
  });

  // Atualizar contagem local
  useEffect(() => {
    if (unreadCountData) {
      setUnreadCount(unreadCountData.unread_count);
    }
  }, [unreadCountData]);

  // Marcar como lida
  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: number) => {
      await api.post(`/notifications/${notificationId}/mark-as-read`);
    },
    onSuccess: () => {
      refetch();
    },
  });

  // Marcar todas como lidas
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      await api.post('/notifications/mark-all-as-read');
    },
    onSuccess: () => {
      refetch();
      setUnreadCount(0);
    },
  });

  // Deletar notificação
  const deleteNotificationMutation = useMutation({
    mutationFn: async (notificationId: number) => {
      await api.delete(`/notifications/${notificationId}`);
    },
    onSuccess: () => {
      refetch();
    },
  });

  const markAsRead = (notificationId: number) => {
    markAsReadMutation.mutate(notificationId);
  };

  const markAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  const deleteNotification = (notificationId: number) => {
    deleteNotificationMutation.mutate(notificationId);
  };

  return {
    notifications: notificationsData?.data || [],
    unreadCount,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refetch,
    isMarkingAsRead: markAsReadMutation.isPending,
    isMarkingAllAsRead: markAllAsReadMutation.isPending,
    isDeleting: deleteNotificationMutation.isPending,
  };
};


