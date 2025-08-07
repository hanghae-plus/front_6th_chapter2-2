import { PropsWithChildren, useCallback, useEffect, useState } from "react";

import NotificationItem from "@/advanced/features/notification/components/NotificationItem";
import { Notification } from "@/advanced/features/notification/types/notification";
import { NOTIFICATION } from "@/advanced/shared/constants/notification";
import { NotificationError } from "@/advanced/shared/errors/NotificationError";

export function NotificationBoundary({ children }: PropsWithChildren) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (event.reason instanceof NotificationError) {
        event.preventDefault();

        const newNotification: Notification = {
          id: Date.now().toString(),
          message: event.reason.message,
          type: event.reason.type,
        };

        setNotifications((prev) => [...prev, newNotification]);

        setTimeout(() => {
          setNotifications((prev) =>
            prev.filter((n) => n.id !== newNotification.id)
          );
        }, NOTIFICATION.TIMEOUT_MS);

        return;
      }

      throw event;
    };

    const handleGlobalError = (event: ErrorEvent) => {
      if (event.error instanceof NotificationError) {
        event.preventDefault();

        const newNotification: Notification = {
          id: Date.now().toString(),
          message: event.error.message,
          type: event.error.type,
        };

        setNotifications((prev) => [...prev, newNotification]);

        setTimeout(() => {
          setNotifications((prev) =>
            prev.filter((n) => n.id !== newNotification.id)
          );
        }, NOTIFICATION.TIMEOUT_MS);

        return;
      }

      throw event;
    };

    window.addEventListener("error", handleGlobalError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      window.removeEventListener("error", handleGlobalError);
      window.removeEventListener(
        "unhandledrejection",
        handleUnhandledRejection
      );
    };
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return (
    <div>
      <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            removeNotification={removeNotification}
          />
        ))}
      </div>
      {children}
    </div>
  );
}
