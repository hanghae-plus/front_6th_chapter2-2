import { useState, useCallback } from "react";
import { useUniqueId } from "../utils/hooks/useUniqueId";

interface Notification {
  id: string;
  message: string;
  type: "error" | "success" | "warning";
}

const TIMEOUT = 3000 as const;

export const useNotification = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const generateId = useUniqueId();

  const addNotification = useCallback(
    (message: string, type: "error" | "success" | "warning" = "success") => {
      const id = generateId();
      setNotifications((prev) => [...prev, { id: `notification_${id}`, message, type }]);

      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, TIMEOUT);
    },
    [generateId]
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return {
    notifications,
    addNotification,
    removeNotification,
  };
};
