import { useCallback, useState } from "react";

import { Notification } from "../models/notification";

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback(
    (message: string, type: "error" | "success" | "warning" = "success") => {
      const id = `${Date.now()}-${Math.random()}`;
      const newNotification: Notification = { id, message, type };

      setNotifications((prev) => [...prev, newNotification]);

      // 3초 후 자동으로 제거
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, 3000);
    },
    [setNotifications]
  );

  const removeNotification = useCallback(
    (id: string) => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    },
    [setNotifications]
  );

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, [setNotifications]);

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    setNotifications,
  };
};
