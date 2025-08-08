import { useState, useCallback } from "react";
import {
  Notification,
  createNotification,
  addNotification as addNotificationUtil,
  removeNotification,
} from "../utils/notification";

/**
 * @deprecated context로 대체
 */
export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback(
    (message: string, type: "error" | "success" | "warning" = "success") => {
      const notification = createNotification(message, type);
      setNotifications((prev) => addNotificationUtil(prev, notification));

      setTimeout(() => {
        setNotifications((prev) => removeNotification(prev, notification.id));
      }, 3000);
    },
    []
  );

  const removeNotificationById = useCallback((notificationId: string) => {
    setNotifications((prev) => removeNotification(prev, notificationId));
  }, []);

  return {
    notifications,
    addNotification,
    removeNotificationById,
  };
};
