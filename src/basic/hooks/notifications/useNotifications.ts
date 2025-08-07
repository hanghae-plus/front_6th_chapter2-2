import { removeNotificationAtom } from '../../../advanced/atoms/notificationsAtom';
import { useCallback, useState } from 'react';
import { Notification } from '../../../types';

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

  const removeNotificationAtom = useCallback((notification: Notification) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notification.id));
  }, []);

  return {
    notifications,
    removeNotificationAtom,
    addNotification,
  };
};
