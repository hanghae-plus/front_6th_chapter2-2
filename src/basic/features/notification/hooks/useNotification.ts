import { useCallback, useState } from "react";

import {
  AddNotification,
  Notification,
  NotificationType,
  RemoveNotification,
} from "@/basic/features/notification/types/notification";
import { NOTIFICATION } from "@/basic/shared/constants/notification";
import { NotificationError } from "@/basic/shared/errors/NotificationError";

export function useNotification(): {
  notifications: Notification[];
  addNotification: AddNotification;
  removeNotification: RemoveNotification;
  throwError: (message: string) => never;
  throwSuccess: (message: string) => never;
  throwWarning: (message: string) => never;
} {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback(
    (message: string, type: NotificationType = NOTIFICATION.TYPES.SUCCESS) => {
      const id = Date.now().toString();

      const newNotification: Notification = { id, message, type };

      setNotifications((prev) => [...prev, newNotification]);

      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, NOTIFICATION.TIMEOUT_MS);
    },
    []
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const throwError = useCallback((message: string): never => {
    throw new NotificationError(message, NOTIFICATION.TYPES.ERROR);
  }, []);

  const throwSuccess = useCallback((message: string): never => {
    throw new NotificationError(message, NOTIFICATION.TYPES.SUCCESS);
  }, []);

  const throwWarning = useCallback((message: string): never => {
    throw new NotificationError(message, NOTIFICATION.TYPES.WARNING);
  }, []);

  return {
    notifications,
    addNotification,
    removeNotification,
    throwError,
    throwSuccess,
    throwWarning,
  };
}
