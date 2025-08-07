import { useState, useCallback } from "react";
import { NotificationType } from "../App";

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
}

interface UseNotificationsReturn {
  notifications: Notification[];
  addNotification: (message: string, type?: NotificationType) => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

/**
 * 알림 관리 Hook
 * - 알림 추가/삭제 기능 제공
 * - 3초 후 자동 삭제
 * - 수동 삭제 기능
 */
export const useNotifications = (): UseNotificationsReturn => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  /**
   * 새 알림 추가
   * 3초 후 자동으로 삭제됨
   */
  const addNotification = useCallback(
    (message: string, type: NotificationType = "success") => {
      const id = Date.now().toString();
      const newNotification: Notification = { id, message, type };

      setNotifications((prev) => [...prev, newNotification]);

      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, 3000);
    },
    []
  );

  const onSuccess = useCallback(
    (message: string) => {
      addNotification(message, "success");
    },
    [addNotification]
  );

  const onError = useCallback(
    (message: string) => {
      addNotification(message, "error");
    },
    [addNotification]
  );

  /**
   * 특정 알림 수동 삭제
   */
  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  /**
   * 모든 알림 삭제
   */
  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    onSuccess,
    onError,
  };
};
