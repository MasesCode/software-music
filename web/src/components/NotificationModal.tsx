import { useState } from 'react';
import { Bell, X, Check, Trash2, ExternalLink, Music, ThumbsUp, ThumbsDown, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNotifications } from '@/hooks/useNotifications';
import { useTranslation } from '@/hooks/useTranslation';
import { Notification } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { ptBR, enUS, es } from 'date-fns/locale';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'approved':
      return <ThumbsUp className="h-5 w-5 text-green-500" />;
    case 'rejected':
      return <ThumbsDown className="h-5 w-5 text-red-500" />;
    case 'auto_approved':
      return <Zap className="h-5 w-5 text-yellow-500" />;
    default:
      return <Bell className="h-5 w-5 text-blue-500" />;
  }
};

const getNotificationColor = (type: Notification['type']) => {
  switch (type) {
    case 'approved':
      return 'bg-green-50 border-green-200';
    case 'rejected':
      return 'bg-red-50 border-red-200';
    case 'auto_approved':
      return 'bg-yellow-50 border-yellow-200';
    default:
      return 'bg-blue-50 border-blue-200';
  }
};

const NotificationItem = ({ notification, onMarkAsRead, onDelete }: {
  notification: Notification;
  onMarkAsRead: (id: number) => void;
  onDelete: (id: number) => void;
}) => {
  const { t, currentLanguage } = useTranslation();
  const handleViewMusic = () => {
    if (notification.music) {
      window.open(`https://www.youtube.com/watch?v=${notification.music.youtube_id}`, '_blank');
    }
  };

  return (
    <Card className={`${getNotificationColor(notification.type)} ${!notification.is_read ? 'ring-2 ring-blue-200' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {getNotificationIcon(notification.type)}
            <div>
              <CardTitle className="text-sm font-medium">{notification.title}</CardTitle>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(notification.created_at), { 
                  addSuffix: true, 
                  locale: currentLanguage.code === 'pt' ? ptBR : currentLanguage.code === 'es' ? es : enUS
                })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {!notification.is_read && (
              <Badge variant="secondary" className="text-xs">
                {t('new')}
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(notification.id)}
              className="h-6 w-6 p-0 text-muted-foreground hover:text-red-500"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground mb-3">{notification.message}</p>
        
        {notification.music && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleViewMusic}
              className="flex items-center gap-1"
            >
              <Music className="h-3 w-3" />
              {t('viewMusic')}
              <ExternalLink className="h-3 w-3" />
            </Button>
          </div>
        )}
        
        {!notification.is_read && (
          <div className="mt-3 pt-3 border-t">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onMarkAsRead(notification.id)}
              className="text-xs"
            >
              <Check className="h-3 w-3 mr-1" />
              {t('markAsRead')}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const NotificationModal = ({ isOpen, onClose }: NotificationModalProps) => {
  const { t } = useTranslation();
  const {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    isMarkingAsRead,
    isDeleting,
  } = useNotifications();

  console.log('🔔 Modal state:', {
    isOpen,
    notifications,
    unreadCount,
    isLoading,
    notificationsLength: notifications.length
  });

  const handleMarkAsRead = (notificationId: number) => {
    markAsRead(notificationId);
  };

  const handleDelete = (notificationId: number) => {
    deleteNotification(notificationId);
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            {t('notifications')}
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">
            {notifications.length} {notifications.length !== 1 ? t('notifications') : t('notification')}
          </p>
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllAsRead}
              disabled={isMarkingAsRead}
            >
              <Check className="h-4 w-4 mr-1" />
              {t('markAllAsRead')}
            </Button>
          )}
        </div>

        <ScrollArea className="h-[400px] pr-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">{t('noNotifications')}</p>
              <p className="text-sm text-muted-foreground">
                {t('noNotificationsDescription')}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={handleMarkAsRead}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

