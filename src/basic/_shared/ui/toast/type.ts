import { ReactNode } from "react";

export type Message = {
  type: "error" | "success" | "warning";
  text: string;
};

export interface ToastCommand {
  show: (message: Message, options: { duration: number }) => void;
  hide: (id: string) => void;
}

export type ToastConfig<Type extends string> = {
  cases: Readonly<
    Record<
      Type,
      ({
        message,
        command,
      }: {
        message: Message & { id: string };
        command: ToastCommand;
      }) => ReactNode
    >
  >;
  defaultDuration: number;
};
