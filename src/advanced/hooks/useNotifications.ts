import { useAtom, useSetAtom } from "jotai";
import { useCallback } from "react";
import {
  notificationsAtom,
  Notification,
  NotificationType,
} from "../atoms/appAtoms";
import {
  addNotificationActionAtom,
  removeNotificationActionAtom,
  addSuccessNotificationActionAtom,
  addErrorNotificationActionAtom,
} from "../atoms/notificationActions";

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
  const [notifications, setNotifications] = useAtom(notificationsAtom);

  const addNotificationAction = useSetAtom(addNotificationActionAtom);
  const removeNotificationAction = useSetAtom(removeNotificationActionAtom);
  const addSuccessNotificationAction = useSetAtom(
    addSuccessNotificationActionAtom
  );
  const addErrorNotificationAction = useSetAtom(addErrorNotificationActionAtom);

  /**
   * 새 알림 추가
   * 3초 후 자동으로 삭제됨
   */
  const addNotification = useCallback(
    (message: string, type: NotificationType = "success") => {
      addNotificationAction({ message, type });
    },
    [addNotificationAction]
  );

  const onSuccess = useCallback(
    (message: string) => {
      addSuccessNotificationAction(message);
    },
    [addSuccessNotificationAction]
  );

  const onError = useCallback(
    (message: string) => {
      addErrorNotificationAction(message);
    },
    [addErrorNotificationAction]
  );

  /**
   * 특정 알림 수동 삭제
   */
  const removeNotification = useCallback(
    (id: string) => {
      removeNotificationAction(id);
    },
    [removeNotificationAction]
  );

  /**
   * 모든 알림 삭제
   */
  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, [setNotifications]);

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    onSuccess,
    onError,
  };
};
