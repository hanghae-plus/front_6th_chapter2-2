import { atom } from "jotai";
import { generateId } from "..";
import { Notification } from "../../types";
import { notificationsAtom } from "../atoms/notificationAtoms";
import { Getter } from "jotai";
import { Setter } from "jotai";

// 알림 추가 헬퍼 함수
export const addNotificationHelper = (
  get: Getter,
  set: Setter,
  message: string,
  type: "error" | "success" | "warning" = "success"
) => {
  const notifications = get(notificationsAtom);
  const newNotification: Notification = {
    id: generateId("notification"),
    message,
    type,
    timestamp: new Date(),
  };
  set(notificationsAtom, [...notifications, newNotification]);

  setTimeout(() => {
    const currentNotifications = get(notificationsAtom);
    const updatedNotifications = currentNotifications.filter(
      (n: Notification) => n.id !== newNotification.id
    );
    set(notificationsAtom, updatedNotifications);
  }, 3000);
};

// 알림 관련 액션
export const addNotificationAtom = atom(
  null,
  (
    get,
    set,
    message: string,
    type: "error" | "success" | "warning" = "success"
  ) => {
    addNotificationHelper(get, set, message, type);
  }
);

// 알림 제거 액션
export const removeNotificationAtom = atom(
  null,
  (get: Getter, set: Setter, notificationId: string) => {
    const notifications = get(notificationsAtom);
    const updatedNotifications = notifications.filter(
      (notification) => notification.id !== notificationId
    );
    set(notificationsAtom, updatedNotifications);
  }
);
