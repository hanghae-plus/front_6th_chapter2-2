import { useAtom } from "jotai";

import { notificationsAtom } from "../store";
import type { NotificationItem } from "../types";

export function useNotifications() {
  const [notifications, setNotifications] = useAtom(notificationsAtom);

  const addNotification = (message: string, type: "error" | "success" | "warning" = "success") => {
    const id = Date.now().toString();
    const newNotification: NotificationItem = { id, message, type };

    setNotifications((prev) => {
      const hasExistingMessage = prev.some((n) => n.message === message);
      if (hasExistingMessage) {
        return prev;
      }

      return [...prev, newNotification];
    });

    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return {
    notifications,
    addNotification,
    removeNotification
  };
}
