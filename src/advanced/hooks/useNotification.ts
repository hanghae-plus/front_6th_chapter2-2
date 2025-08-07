import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { notificationsAtom, addNotificationAtom, removeNotificationAtom } from "../stores/notificationStore";

export const useNotification = () => {
  const [notifications] = useAtom(notificationsAtom);
  const addNotificationSet = useSetAtom(addNotificationAtom);
  const removeNotificationSet = useSetAtom(removeNotificationAtom);

  const addNotification = (message: string, type: "error" | "success" | "warning" = "success") => {
    addNotificationSet({ message, type });
  };

  const removeNotification = (id: string) => {
    removeNotificationSet(id);
  };

  return {
    notifications,
    addNotification,
    removeNotification,
  };
};
