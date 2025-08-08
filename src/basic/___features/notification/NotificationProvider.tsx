import { PropsWithChildren } from "react";
import { ToastProvider } from "../../_shared/ui/toast";
import Toast from "../../_shared/ui/toast/Toast";
import Notification from "./Notification";

export type NotificationType = 'success' | 'error' | 'warning';

function NotificationProvider({ children }: PropsWithChildren) {
  return (
    <ToastProvider<NotificationType>
      config={{
        cases: {
          success: ({ message, command }) => (
            <Notification
              text={message.text}
              onClickCloseButton={() => command.hide(message.id)}
              className="bg-green-600"
            />
          ),
          error: ({ message, command }) => (
            <Notification
              text={message.text}
              onClickCloseButton={() => command.hide(message.id)}
              className="bg-red-600"
            />
          ),
          warning: ({ message, command }) => (
            <Notification
              text={message.text}
              onClickCloseButton={() => command.hide(message.id)}
              className="bg-yellow-600"
            />
          ),
        },
        defaultDuration: 3000,
      }}
    >
      {children}
      <Toast className="fixed top-20 right-4 z-50 space-y-2 max-w-sm" />
    </ToastProvider>
  );
}

export default NotificationProvider;
