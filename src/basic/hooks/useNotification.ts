import { useCallback, useState } from 'react';
import { NotificationType } from '../types';

export const useNotification = () => {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);

  const addNotification = useCallback(
    (message: string, type: 'error' | 'success' | 'warning' = 'success') => {
      const id = Date.now().toString();
      setNotifications((prev) => [...prev, { id, message, type }]);

      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, 3000);
    },
    []
  );

  return { notifications, setNotifications, addNotification };
};
