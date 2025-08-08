export interface Notification {
  id: string;
  message: string;
  type: "error" | "success" | "warning";
}

export type NotificationType = Notification["type"];
export type HandleNotificationAdd = (
  message: string,
  type?: NotificationType
) => void;
