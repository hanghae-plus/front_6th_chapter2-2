import { atom } from "jotai";
import { notificationsAtom, Notification, NotificationType } from "./appAtoms";

/**
 * 알림 추가 액션
 */
export const addNotificationActionAtom = atom(
  null,
  (
    get,
    set,
    { message, type }: { message: string; type: NotificationType }
  ) => {
    const notifications = get(notificationsAtom);
    const newNotification: Notification = {
      id: Date.now().toString(),
      message,
      type,
    };
    set(notificationsAtom, [...notifications, newNotification]);

    setTimeout(() => {
      set(removeNotificationActionAtom, newNotification.id);
    }, 3000);
  }
);

/**
 * 알림 제거 액션
 */
export const removeNotificationActionAtom = atom(
  null,
  (get, set, notificationId: string) => {
    const notifications = get(notificationsAtom);
    const updatedNotifications = notifications.filter(
      (notification) => notification.id !== notificationId
    );
    set(notificationsAtom, updatedNotifications);
  }
);

/**
 * 성공 알림 추가 액션
 */
export const addSuccessNotificationActionAtom = atom(
  null,
  (_get, set, message: string) => {
    set(addNotificationActionAtom, {
      message,
      type: "success" as NotificationType,
    });
  }
);

/**
 * 에러 알림 추가 액션
 */
export const addErrorNotificationActionAtom = atom(
  null,
  (_get, set, message: string) => {
    set(addNotificationActionAtom, {
      message,
      type: "error" as NotificationType,
    });
  }
);
