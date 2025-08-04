import { createPortal } from "react-dom";
import { cn } from "../../tw-utility/cn";
import { ToastCommandContext, ToastValueContext } from "./Provider";
import { use } from "react";

function Toast({ className }: { className?: string }) {
  const { messages, config } = use(ToastValueContext);
  const { hide } = use(ToastCommandContext);

  if (messages.length === 0) return null;

  return createPortal(
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 flex flex-col gap-2",
        className
      )}
    >
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            "p-4 rounded-md shadow-md text-white flex justify-between items-center",
            config.cases[message.type].className
          )}
        >
          <span className="mr-2">{message.message}</span>
          <button
            type="button"
            onClick={() => hide(message.id)}
            className="text-white hover:text-gray-200"
          >
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
          </button>
        </div>
      ))}
    </div>,
    document.body
  );
}

export default Toast;
