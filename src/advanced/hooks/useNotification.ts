import { useState, useCallback } from "react";

interface Notification {
  id: string;
  message: string;
  type: "error" | "success" | "warning";
}

const TIMEOUT = 3000 as const;

export const useNotification = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((message: string, type: "error" | "success" | "warning" = "success") => {
    const id = Math.random().toString(36).substring(2, 15);
    setNotifications((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, TIMEOUT);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return {
    notifications,
    addNotification,
    removeNotification,
  };
};
