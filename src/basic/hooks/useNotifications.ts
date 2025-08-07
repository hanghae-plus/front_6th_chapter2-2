import { useState, useCallback } from 'react';
import { Notification } from '../types';

/**
 * 알림(Notification) 상태를 관리하는 커스텀 Hook
 *
 * @returns { notifications, addNotification, removeNotification }
 */
export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback(
    (message: string, type: 'error' | 'success' | 'warning' = 'success') => {
      const id = Date.now().toString();

      // 알림 추가
      setNotifications(prev => [...prev, { id, message, type }]);

      // 3초 후 자동 제거
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }, 3000);
    },
    []
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  return {
    notifications,
    addNotification,
    removeNotification,
  };
};
