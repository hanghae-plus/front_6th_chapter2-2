import { useCallback } from "react";
import { useAtom } from "jotai";
import { notificationsAtom, notificationActionsAtom } from "../atoms";

export function useNotification() {
  const [notifications] = useAtom(notificationsAtom);
  const [, notificationActions] = useAtom(notificationActionsAtom);

  const addNotification = useCallback(
    (message: string, type: "error" | "success" | "warning" = "success") => {
      notificationActions({
        type: "ADD",
        payload: { message, type },
      });
    },
    [notificationActions]
  );

  const removeNotification = useCallback(
    (id: string) => {
      notificationActions({
        type: "REMOVE",
        payload: { id },
      });
    },
    [notificationActions]
  );

  return {
    notifications,
    addNotification,
    removeNotification,
  };
}
