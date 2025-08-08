import { useCallback } from "react";
import { addGlobalNotification } from "@shared/libs/notificationStore";
import { NotificationVariant } from "../types";

export function useGlobalNotification() {
  const addNotification = useCallback(addGlobalNotification, []);

  const showSuccessNotification = useCallback(
    (message: string) => addNotification(message, NotificationVariant.SUCCESS),
    [addNotification]
  );

  const showErrorNotification = useCallback(
    (message: string) => addNotification(message, NotificationVariant.ERROR),
    [addNotification]
  );

  const showWarningNotification = useCallback(
    (message: string) => addNotification(message, NotificationVariant.WARNING),
    [addNotification]
  );

  return {
    showSuccessNotification,
    showErrorNotification,
    showWarningNotification,
  };
}
