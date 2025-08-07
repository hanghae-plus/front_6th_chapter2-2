import { useCallback } from "react";
import { addGlobalNotification } from "@shared/libs/notificationStore";

export function useGlobalNotification() {
  const addNotification = useCallback(addGlobalNotification, []);

  return {
    addNotification,
  };
}
