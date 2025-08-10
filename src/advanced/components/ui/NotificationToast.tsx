import React, { useEffect } from "react";
import { useAtom } from "jotai";
import { XIcon } from "../icons";
import Button from "./Button";
import { notificationsAtom, notificationActionsAtom } from "../../atoms";

export interface Notification {
  id: string;
  message: string;
  type: "error" | "success" | "warning";
}

const NotificationToast: React.FC = () => {
  const [notifications] = useAtom(notificationsAtom);
  const [, notificationActions] = useAtom(notificationActionsAtom);

  const handleRemove = (id: string) => {
    notificationActions({ type: "REMOVE", payload: { id } });
  };

  // 3초 후 자동으로 알림 제거
  useEffect(() => {
    notifications.forEach((notification) => {
      const timer = setTimeout(() => {
        handleRemove(notification.id);
      }, 3000);

      return () => clearTimeout(timer);
    });
  }, [notifications]);

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`p-4 rounded-md shadow-md text-white flex justify-between items-center animate-in slide-in-from-right-2 duration-300 ${
            notification.type === "error"
              ? "bg-red-600"
              : notification.type === "warning"
              ? "bg-yellow-600"
              : "bg-green-600"
          }`}
        >
          <span className="mr-2 flex-1">{notification.message}</span>
          <Button
            onClick={() => handleRemove(notification.id)}
            variant="ghost"
            size="small"
            className="text-white hover:text-gray-200 p-1 flex items-center justify-center ml-2"
          >
            <XIcon className="w-4 h-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};

export default NotificationToast;
