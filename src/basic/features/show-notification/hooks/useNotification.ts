import { useState, useCallback } from "react";
import {
  NotificationVariant,
  type Notification as NotificationType,
} from "../../../entities/notification/types";

export function useNotification() {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);

  const addNotification = useCallback(
    (
      message: string,
      variant: NotificationVariant = NotificationVariant.SUCCESS
    ) => {
      const id = Date.now().toString();
      setNotifications((prev) => [...prev, { id, message, variant }]);

      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, 3000);
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
