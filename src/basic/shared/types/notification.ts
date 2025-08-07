export interface Notification {
  id: string;
  message: string;
  type: "error" | "success" | "warning";
}
