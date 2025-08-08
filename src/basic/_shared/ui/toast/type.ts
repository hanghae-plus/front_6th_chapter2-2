import { ReactNode } from "react";

export type Message<Type extends string = string> = {
  type: Type;
  text: string;
};

export type MessageWithId<Type extends string = string> = Message<Type> & { id: string };

export interface ToastCommand<Type extends string = string> {
  show: (message: Message<Type>, options: { duration: number }) => void;
  hide: (id: string) => void;
}

export type ToastConfig<Type extends string = string> = {
  cases: Readonly<
    Record<
      Type,
      ({
        message,
        command,
      }: {
        message: MessageWithId<Type>;
        command: ToastCommand<Type>;
      }) => ReactNode
    >
  >;
  defaultDuration: number;
};
