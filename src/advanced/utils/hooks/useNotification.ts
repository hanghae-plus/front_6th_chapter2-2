import { useAtom } from "jotai";
import { notificationsAtom } from "../../atoms";
import { useCallback } from "react";

export const useNotification = () => {
  const [notifications, setNotifications] = useAtom(notificationsAtom);

  const addNotification = useCallback(
    (message: string, type: "error" | "success" | "warning" = "success") => {
      const id = Date.now().toString();
      setNotifications((prev) => [...prev, { id, message, type }]);

      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, 3000);
    },
    []
  );

  return { notifications, addNotification } as const;
};
