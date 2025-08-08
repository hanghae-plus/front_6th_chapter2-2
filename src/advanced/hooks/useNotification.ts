import { useAtom, useAtomValue } from "jotai";
import { useCallback } from "react";
import {
  notificationsAtom,
  addNotificationAtom,
  removeNotificationAtom,
} from "../atoms";

export function useNotificationJotai() {
  const notifications = useAtomValue(notificationsAtom);
  const [, addNotificationAction] = useAtom(addNotificationAtom);
  const [, removeNotificationAction] = useAtom(removeNotificationAtom);

  const addNotification = useCallback(
    (message: string, type: "error" | "success" | "warning" = "success") => {
      addNotificationAction({ message, type });
    },
    [addNotificationAction]
  );

  const removeNotification = useCallback(
    (id: string) => {
      removeNotificationAction(id);
    },
    [removeNotificationAction]
  );

  return {
    notifications,
    addNotification,
    removeNotification,
  };
}
