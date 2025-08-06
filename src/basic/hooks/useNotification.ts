import { useCallback, useState } from "react";

import { NOTIFICATION_TIMEOUT_MS } from "@/basic/constants/notification";
import { Notification, NotificationType } from "@/types";

export function useNotification() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback(
    (message: string, type: NotificationType = NotificationType.SUCCESS) => {
      const id = Date.now().toString();

      const newNotification: Notification = { id, message, type };

      setNotifications((prev) => [...prev, newNotification]);

      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, NOTIFICATION_TIMEOUT_MS);
    },
    []
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return {
    notifications,
    addNotification,
    removeNotification,
  };
}
