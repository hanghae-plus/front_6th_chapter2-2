import { useNotificationStore } from "../../../entities/notification/hooks/useNotificationStore";

export function useNotification() {
  return useNotificationStore();
}
