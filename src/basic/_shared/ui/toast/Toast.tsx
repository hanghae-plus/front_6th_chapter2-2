import { createPortal } from "react-dom";
import { cn } from "../../tw-utility/cn";
import { ToastCommandContext, ToastValueContext } from "./Provider";
import { Fragment, use } from "react";

function Toast({ className }: { className?: string }) {
  const { messages, config } = use(ToastValueContext);
  const command = use(ToastCommandContext);

  if (messages.length === 0) return null;

  return createPortal(
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 flex flex-col gap-2",
        className
      )}
    >
      {messages.map((message) => (
        <Fragment key={message.id}>
          {config.cases[message.type]({
            message,
            command,
          })}
        </Fragment>
      ))}
    </div>,
    document.body
  );
}

export default Toast;
