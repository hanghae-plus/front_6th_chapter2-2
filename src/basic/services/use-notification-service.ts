import {
  Notification,
  NotificationType,
  notificationTypeSchema,
} from '@/basic/models/notification';
import { useState } from 'react';

export const useNotificationService = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (
    message: string,
    type: NotificationType = notificationTypeSchema.enum.success
  ) => {
    setNotifications(prev => [
      ...prev,
      { id: Date.now().toString(), message, type },
    ]);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return { notifications, addNotification, removeNotification };
};
