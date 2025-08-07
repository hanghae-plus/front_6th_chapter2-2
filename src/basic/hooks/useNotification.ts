import { useState } from "react";
import { Notification } from "../../types";

export const useNotification = () => {
  const [notifications, setNotifications] = useState<Array<Notification>>([]);

  const addNotification = (
    message: string,
    type: "error" | "success" | "warning" = "success"
  ) => {
    const id = Date.now().toString();
    setNotifications((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return {
    notifications,
    addNotification,
    removeNotification,
  };
};
