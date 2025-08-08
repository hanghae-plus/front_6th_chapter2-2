import { useNotificationStore } from "@entities/notification";

export function useNotification() {
  return useNotificationStore();
}
