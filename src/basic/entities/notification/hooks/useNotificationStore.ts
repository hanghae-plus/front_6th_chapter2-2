import { useState, useCallback, useEffect } from "react";
import { type Notification as NotificationType } from "../types";
import {
  addGlobalNotification,
  removeGlobalNotification,
  subscribeToNotifications,
} from "../../../shared/libs/notificationStore";

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
