import {
  Notification,
  NotificationType,
  notificationTypeSchema
} from '@/models/notification';
import { createContext, use, useState } from 'react';

const NotificationContext = createContext<{
  notifications: Notification[];
  addNotification: (message: string, type?: NotificationType) => void;
  removeNotification: (id: string) => void;
} | null>(null);

export const useNotificationService = () => {
  const service = use(NotificationContext);

  if (!service) {
    throw new Error('');
  }

  return service;
};

export const NotificationProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (
    message: string,
    type: NotificationType = notificationTypeSchema.enum.success
  ) => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeNotification(id);
    }, 3000);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, removeNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};
