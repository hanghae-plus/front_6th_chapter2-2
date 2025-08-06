import { useCallback, useState } from 'react';
import type { Notification } from '../../types';
import * as notificationModel from '../models/notification';

interface UseNotificationReturn {
  notifications: Notification[];
  addNotification: (params: {
    message: string;
    type?: 'error' | 'success' | 'warning';
  }) => void;
  removeNotification: (params: { id: string }) => void;
}

export function useNotification(): UseNotificationReturn {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  return {
    notifications,

    addNotification: useCallback(({ message, type = 'success' }) => {
      setNotifications((prevNotifications) => {
        const TOAST_DURATION = 3_000;
        const id = Date.now().toString();
        setTimeout(() => {
          setNotifications((prev) => prev.filter((n) => n.id !== id));
        }, TOAST_DURATION);
        return notificationModel.addNotification({
          notifications: prevNotifications,
          id,
          message,
          type,
        });
      });
    }, []),

    removeNotification: useCallback(({ id }) => {
      setNotifications((prevNotifications) =>
        notificationModel.removeNotification({
          id,
          notifications: prevNotifications,
        })
      );
    }, []),
  };
}
