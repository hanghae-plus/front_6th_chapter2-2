export interface NotificationItem {
  id: string;
  message: string;
  type: "error" | "success" | "warning";
}

export type NotificationFunction = (
  message: string,
  type?: "error" | "success" | "warning"
) => void;
