import { NotificationType } from "@/basic/features/notification/types/notification";

export class NotificationError extends Error {
  constructor(
    public message: string,
    public type: NotificationType
  ) {
    super(message);
    this.name = "NotificationError";
    this.type = type;
  }
}
