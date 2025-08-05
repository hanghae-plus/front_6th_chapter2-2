import { useState, useCallback } from "react";
import { INotification } from "../type";

export const useNotification = () => {
  // 토스트 모달 알람 배열
  const [notifications, setNotifications] = useState<INotification[]>([]);

  // 알림 생성
  const addNotification = useCallback(
    (message: string, type: "error" | "success" | "warning" = "success") => {
      // 알림 구분을 위한 고유 식별자
      const id = Date.now().toString();
      setNotifications((prev) => [...prev, { id, message, type }]);

      // 3초 후 해당 알림 제거
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, 3000);
    },
    []
  );

  // 알림 삭제
  const removeNotification = (notif: INotification) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notif.id));
  };

  return {
    notifications,
    addNotification,
    removeNotification,
  };
};
