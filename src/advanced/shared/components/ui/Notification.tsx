import { tv } from "tailwind-variants";

import type { NotificationItem } from "../../types";
import { CloseIcon } from "../icons";

type NotificationProps = NotificationItem & {
  onRemove: (id: string) => void;
  className?: string;
};

const notification = tv({
  base: "flex items-center justify-between rounded-md p-4 text-white shadow-md",
  variants: {
    intent: {
      success: "bg-green-600",
      warning: "bg-yellow-600",
      error: "bg-red-600"
    }
  },
  defaultVariants: {
    intent: "success"
  }
});

export function Notification({ id, message, type, onRemove, className }: NotificationProps) {
  const handleRemove = () => onRemove(id);

  return (
    <div className={notification({ intent: type, className })}>
      <span className="mr-2">{message}</span>
      <button className="text-white hover:text-gray-200" onClick={handleRemove}>
        <CloseIcon />
      </button>
    </div>
  );
}
