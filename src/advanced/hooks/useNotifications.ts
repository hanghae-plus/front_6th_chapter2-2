import { useState, useCallback } from 'react';

import { Notification } from '../../types';

export const useNotifications = (timeout = 3000) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const dismissNotification = useCallback(
    (id: string) => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    },
    [setNotifications],
  );

  const addNotification = useCallback(
    (message: string, type: 'error' | 'success' | 'warning' = 'success') => {
      const id = Date.now().toString();
      setNotifications((prev) => [...prev, { id, message, type }]);

      setTimeout(() => {
        dismissNotification(id);
      }, timeout);
    },
    [dismissNotification, timeout],
  );

  return { notifications, addNotification, dismissNotification };
};
