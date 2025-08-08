import CloseIcon from "@assets/icons/CloseIcon.svg?react";
import {
  NotificationVariant,
  type NotificationType,
} from "@entities/notification";
import { IconButton } from "@shared";
import { memo } from "react";

interface NotificationItemProps extends NotificationType {
  onRemove: (id: string) => void;
}

export interface NotificationConfig {
  bgColor: string;
  textColor: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export const notificationConfigMap: Record<string, NotificationConfig> = {
  [NotificationVariant.ERROR]: {
    bgColor: "bg-red-600",
    textColor: "text-white",
  },
  [NotificationVariant.WARNING]: {
    bgColor: "bg-yellow-600",
    textColor: "text-white",
  },
  [NotificationVariant.SUCCESS]: {
    bgColor: "bg-green-600",
    textColor: "text-white",
  },
};

export const NotificationItem = memo(
  ({ id, message, variant, onRemove }: NotificationItemProps) => {
    const config = notificationConfigMap[variant];

    return (
      <div
        className={`p-4 rounded-md shadow-md ${config.bgColor} ${config.textColor} flex justify-between items-center`}
      >
        <span className="mr-2">{message}</span>
        <IconButton
          variant="icon"
          onClick={() => onRemove(id)}
          className="text-white hover:text-gray-200"
        >
          <CloseIcon className="w-4 h-4" />
        </IconButton>
      </div>
    );
  }
);
