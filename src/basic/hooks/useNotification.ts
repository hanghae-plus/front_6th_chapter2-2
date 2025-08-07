import { useState, useCallback } from 'react';
import { Notification } from '../shared/types';
import { NOTIFICATION_DURATION } from '../shared/constants/toast';

/**
 * 알림 관리 Hook
 */
export function useNotification() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  /**
   * 알림 메시지를 추가하고, 3초 후에 알림을 삭제
   * @param message - 알림 메시지
   * @param type - 알림 메시지 타입
   */
  const addNotification = useCallback((message: string, type: 'error' | 'success' | 'warning' = 'success') => {
    const id = Date.now().toString();
    setNotifications((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, NOTIFICATION_DURATION);
  }, []);

  /**
   * 특정 알림 제거
   * @param id - 제거할 알림 ID
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
