import { useState, useCallback, useRef } from 'react';
import { NotificationType } from '../../types';

export function useNotification() {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const timeoutsRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const addNotification = useCallback(
    (message: string, type: 'error' | 'success' | 'warning' = 'success') => {
      const id = Date.now().toString();

      // 기존 알림 중 같은 메시지가 있으면 제거
      setNotifications((prev) => {
        const filtered = prev.filter((n) => n.message !== message);
        return [...filtered, { id, message, type }];
      });

      // 기존 타이머가 있으면 제거
      const existingTimeout = timeoutsRef.current.get(id);
      if (existingTimeout) {
        clearTimeout(existingTimeout);
      }

      // 새로운 타이머 설정
      const timeout = setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
        timeoutsRef.current.delete(id);
      }, 3000);

      timeoutsRef.current.set(id, timeout);
    },
    [],
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));

    // 타이머도 제거
    const timeout = timeoutsRef.current.get(id);
    if (timeout) {
      clearTimeout(timeout);
      timeoutsRef.current.delete(id);
    }
  }, []);

  return {
    notifications,
    setNotifications: removeNotification,
    addNotification,
  };
}
