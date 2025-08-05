import { useCallback, useState } from 'react';
import type { Notification } from '../../types';

export interface AddNotificationParams {
  message: string;
  type: 'error' | 'success' | 'warning';
}

export function useNotification() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback(
    ({ message, type = 'success' }: AddNotificationParams) => {
      const id = Date.now().toString();
      setNotifications((prev) => {
        const next = [...prev, { id, message, type }];
        return next;
      });

      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, 3000);
    },
    []
  );

  return {
    notifications,
    setNotifications,
    addNotification,
  };
}
