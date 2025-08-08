import { cn } from "../../_shared/tw-utility/cn";

interface NotificationProps {
  text: string;
  onClickCloseButton: () => void;
  className?: string;
}

function Notification({
  text,
  onClickCloseButton,
  className,
}: NotificationProps) {
  return (
    <div
      className={cn(
        "p-4 rounded-md shadow-md text-white flex justify-between items-center",
        className
      )}
    >
      <span className="mr-2">{text}</span>
      <button
        type="button"
        onClick={onClickCloseButton}
        className="text-white hover:text-gray-200"
      >
        <CloseIcon />
      </button>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}

export default Notification;
