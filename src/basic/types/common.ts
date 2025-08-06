export interface ActionResult {
  success: boolean;
  message: string;
  type?: "success" | "error" | "warning";
}

export type NotificationType = "success" | "error" | "warning";

export interface FormState<T> {
  data: T;
  isSubmitting: boolean;
  errors: Partial<Record<keyof T, string>>;
}
