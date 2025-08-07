import { useCallback, useState } from "react";

import {
  AddNotification,
  Notification,
  NotificationType,
  RemoveNotification,
} from "@/basic/features/notification/types/notification";
import { NOTIFICATION } from "@/basic/shared/constants/notification";

export function useNotification(): {
  notifications: Notification[];
  addNotification: AddNotification;
  removeNotification: RemoveNotification;
} {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback(
    (message: string, type: NotificationType = NOTIFICATION.TYPES.SUCCESS) => {
      const id = Date.now().toString();

      const newNotification: Notification = { id, message, type };

      setNotifications((prev) => [...prev, newNotification]);

      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, NOTIFICATION.TIMEOUT_MS);
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
