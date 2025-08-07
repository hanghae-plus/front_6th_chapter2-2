import {
  NotificationVariant,
  type Notification as NotificationType,
} from "../../entities/notification/types";

let globalNotifications: NotificationType[] = [];
const listeners: Array<(notifications: NotificationType[]) => void> = [];

const notify = () => {
  listeners.forEach((listener) => listener([...globalNotifications]));
};

export const addGlobalNotification = (
  message: string,
  variant: NotificationVariant = NotificationVariant.SUCCESS
) => {
  const id = Date.now().toString();
  globalNotifications = [...globalNotifications, { id, message, variant }];
  notify();

  setTimeout(() => {
    globalNotifications = globalNotifications.filter((n) => n.id !== id);
    notify();
  }, 3000);
};

export const removeGlobalNotification = (id: string) => {
  globalNotifications = globalNotifications.filter((n) => n.id !== id);
  notify();
};

export const subscribeToNotifications = (
  listener: (notifications: NotificationType[]) => void
) => {
  listeners.push(listener);
  listener([...globalNotifications]);

  return () => {
    const index = listeners.indexOf(listener);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  };
};

export const clearNotifications = () => {
  globalNotifications = [];
  notify();
};
