import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Notification, NotificationResponse } from '@/types';
import { useAuthStore } from '@/store/auth';

export const useNotifications = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const { isAuthenticated } = useAuthStore();

  const {
    data: notificationsData,
    isLoading,
    error,
    refetch,
  } = useQuery<NotificationResponse>({
    queryKey: ['notifications'],
    queryFn: async () => {
      console.log('🔔 Fetching notifications...');
      const response = await api.get<NotificationResponse>('/notifications');
      console.log('🔔 Notifications response:', response);
      return response;
    },
    refetchInterval: isAuthenticated ? 30000 : false,
    enabled: isAuthenticated,
  });

  const { data: unreadCountData } = useQuery<{ unread_count: number }>({
    queryKey: ['notifications-unread-count'],
    queryFn: async () => {
      console.log('🔔 Fetching unread count...');
      const response = await api.get<{ unread_count: number }>('/notifications/unread-count');
      console.log('🔔 Unread count response:', response);
      return response;
    },
    refetchInterval: isAuthenticated ? 10000 : false,
    enabled: isAuthenticated,
  });

  useEffect(() => {
    console.log('🔔 Unread count data changed:', unreadCountData);
    if (unreadCountData && typeof unreadCountData.unread_count === 'number') {
      console.log('🔔 Setting unread count to:', unreadCountData.unread_count);
      setUnreadCount(unreadCountData.unread_count);
    }
  }, [unreadCountData]);

  useEffect(() => {
    if (!isAuthenticated) {
      setUnreadCount(0);
    }
  }, [isAuthenticated]);

  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: number) => {
      await api.post(`/notifications/${notificationId}/mark-as-read`);
    },
    onSuccess: () => {
      refetch();
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      await api.post('/notifications/mark-all-as-read');
    },
    onSuccess: () => {
      refetch();
      setUnreadCount(0);
    },
  });

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

  console.log('🔔 Hook state:', {
    notificationsData,
    notifications: notificationsData?.data || [],
    unreadCount,
    isLoading,
    error,
    isAuthenticated
  });

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


