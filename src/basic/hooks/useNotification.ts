import { useState, useCallback } from "react";

interface Notification {
  id: string;
  message: string;
  type: "error" | "success" | "warning";
}

const TIMEOUT = 3000 as const;

// 고유한 ID 생성 함수
let notificationIdCounter = 0;
const generateNotificationId = () => {
  notificationIdCounter += 1;
  return `${Date.now()}_${notificationIdCounter}`;
};

export const useNotification = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((message: string, type: "error" | "success" | "warning" = "success") => {
    const id = generateNotificationId();
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
