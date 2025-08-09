export interface Notification {
  id: string;
  message: string;
  type: "error" | "success" | "warning";
}

export interface NotificationState {
  notifications: Notification[];
}

export interface AddNotificationParams {
  message: string;
  type: "error" | "success" | "warning";
}
