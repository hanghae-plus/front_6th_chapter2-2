import { useState, useCallback, useEffect } from "react";
import { type Notification as NotificationType } from "../types";
import {
  addGlobalNotification,
  removeGlobalNotification,
  subscribeToNotifications,
} from "../../../shared/libs/notificationStore";

export function useNotificationStore() {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);

  // 컴포넌트가 마운트될 때 구독자 등록
  useEffect(() => {
    const unsubscribe = subscribeToNotifications(setNotifications);
    return unsubscribe;
  }, []);

  const addNotification = useCallback(addGlobalNotification, []);
  const removeNotification = useCallback(removeGlobalNotification, []);

  return {
    notifications,
    addNotification,
    removeNotification,
  };
}
