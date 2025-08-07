import { atom } from "jotai";

export interface Notification {
  id: string;
  message: string;
  type: "error" | "success" | "warning";
  timestamp: number;
}

export const notificationsAtom = atom<Notification[]>([]);

export const notificationActionsAtom = atom(
  (get) => get(notificationsAtom),
  (get, set, action: { type: "ADD" | "REMOVE"; payload: any }) => {
    const notifications = get(notificationsAtom);

    switch (action.type) {
      case "ADD": {
        const { message, type = "success" } = action.payload;
        const newNotification: Notification = {
          id: Date.now().toString(),
          message,
          type,
          timestamp: Date.now(),
        };
        set(notificationsAtom, [...notifications, newNotification]);
        break;
      }

      case "REMOVE": {
        const { id } = action.payload;
        set(
          notificationsAtom,
          notifications.filter((notification) => notification.id !== id)
        );
        break;
      }
    }
  }
);
