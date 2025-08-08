import { useState, useCallback, useEffect } from "react";
import { NotificationType } from "@entities/notification";
import {
  addGlobalNotification,
  removeGlobalNotification,
  subscribeToNotifications,
} from "@shared/libs/notificationStore";

export function useNotificationStore() {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);

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
