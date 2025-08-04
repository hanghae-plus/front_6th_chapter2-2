import { useState, useCallback } from 'react';

interface Notification {
  id: string;
  message: string;
  type: 'error' | 'success' | 'warning';
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback(
    (message: string, type: 'error' | 'success' | 'warning' = 'success') => {
      const id = Date.now().toString();
      setNotifications((prev) => [...prev, { id, message, type }]);

      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, 3000);
    },
    [],
  );
  return { notifications, setNotifications, addNotification };
};
