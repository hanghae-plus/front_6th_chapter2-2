import { PropsWithChildren } from "react";
import { ToastProvider } from "../../_shared/ui/toast";
import Toast from "../../_shared/ui/toast/Toast";

function NotificationProvider({ children }: PropsWithChildren) {
  return (
    <ToastProvider
      config={{
        cases: {
          success: { className: "bg-green-600" },
          error: { className: "bg-red-600" },
          warning: { className: "bg-yellow-600" },
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
