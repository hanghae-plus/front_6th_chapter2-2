import { useCallback, useState } from "react";

interface Notification {
  id: string;
  message: string;
  type: "error" | "success" | "warning";
}

export default function useNotification() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const add = useCallback(
    (
      message: string,
      type: "error" | "success" | "warning" = "success",
      duration: number = 3000
    ) => {
      const id = Date.now().toString();
      setNotifications((prev) => [...prev, { id, message, type }]);

      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, duration);
    },
    []
  );

  const remove = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clear = useCallback(() => {
    setNotifications([]);
  }, []);

  return {
    notifications,
    add,
    remove,
    clear,
  };
}
