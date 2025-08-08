import { useCallback, useState } from "react";
import { Notification } from "../entities/Notification";

export function useNotification() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const handleNotificationAdd = useCallback(
    (message: string, type: "error" | "success" | "warning" = "success") => {
      const id = Date.now().toString();
      setNotifications((prev) => [...prev, { id, message, type }]);

      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, 3000);
    },
    []
  );

  return { notifications, setNotifications, handleNotificationAdd };
}
