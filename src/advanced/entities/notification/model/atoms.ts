import { atom } from "jotai";
import type { NotificationType } from "../types";
import { NotificationVariant } from "../types";

export const notificationsAtom = atom<NotificationType[]>([]);

export const addNotificationAtom = atom(
  null,
  (get, set, notification: Omit<NotificationType, "id">) => {
    const current = get(notificationsAtom);

    const duplicateExists = current.some(
      (n) =>
        n.message === notification.message && n.variant === notification.variant
    );

    if (duplicateExists) {
      return;
    }

    const newNotification: NotificationType = {
      ...notification,
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };

    set(notificationsAtom, [...current, newNotification]);

    setTimeout(() => {
      set(removeNotificationAtom, newNotification.id);
    }, 3000);
  }
);

export const removeNotificationAtom = atom(null, (get, set, id: string) => {
  const current = get(notificationsAtom);
  set(
    notificationsAtom,
    current.filter((notification) => notification.id !== id)
  );
});

export const addSuccessNotificationAtom = atom(
  null,
  (_, set, message: string) => {
    set(addNotificationAtom, { message, variant: NotificationVariant.SUCCESS });
  }
);

export const addErrorNotificationAtom = atom(
  null,
  (_, set, message: string) => {
    set(addNotificationAtom, { message, variant: NotificationVariant.ERROR });
  }
);

export const addWarningNotificationAtom = atom(
  null,
  (_, set, message: string) => {
    set(addNotificationAtom, { message, variant: NotificationVariant.WARNING });
  }
);
