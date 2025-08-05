import { useCallback, useState } from "react";
export type NotificationType = "error" | "success" | "warning";
export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback(
    (message: string, type: NotificationType = "success") => {
      const id = Date.now().toString();
      setNotifications((prev) => [...prev, { id, message, type }]);

      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, 3000);
    },
    []
  );

  return {
    notifications,
    setNotifications,
    addNotification,
  };
};
