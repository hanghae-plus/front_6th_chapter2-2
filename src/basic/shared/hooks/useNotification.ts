import { useState, useCallback } from 'react';

export interface Notification {
  id: string;
  message: string;
  type: 'error' | 'success' | 'warning';
}

export interface UseNotificationReturn {
  notifications: Notification[];
  addNotification: (
    message: string,
    type?: 'error' | 'success' | 'warning'
  ) => void;
  removeNotification: (id: string) => void;
}

/**
 * 알림 시스템을 관리하는 커스텀 훅
 * 알림 추가, 자동 제거, 수동 제거 기능 제공
 */
export function useNotification(): UseNotificationReturn {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  /**
   * 새 알림 추가 (3초 후 자동 제거)
   */
  const addNotification = useCallback(
    (message: string, type: 'error' | 'success' | 'warning' = 'success') => {
      const id = Date.now().toString();
      const newNotification: Notification = { id, message, type };

      setNotifications((prev) => [...prev, newNotification]);

      // 3초 후 자동 제거
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, 3000);
    },
    []
  );

  /**
   * 특정 알림 수동 제거
   */
  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return {
    notifications,
    addNotification,
    removeNotification,
  };
}
