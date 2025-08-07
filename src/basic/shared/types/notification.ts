export interface NotificationItem {
  id: string;
  message: string;
  type: "error" | "success" | "warning";
}
