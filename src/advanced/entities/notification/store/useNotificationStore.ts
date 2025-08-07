import { useCallback, useState } from 'react';

import type { NotificationVariant, Notification } from '../consts';

export function useNotificationStore() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const addNotification = useCallback(
    (message: string, variant: NotificationVariant = 'success') => {
      const id = Date.now().toString();
      setNotifications((prev) => [...prev, { id, message, variant }]);
    },
    []
  );

  return { notifications, addNotification, removeNotification };
}
