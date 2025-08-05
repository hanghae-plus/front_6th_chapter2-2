import {
  createContext,
  PropsWithChildren,
  useMemo,
  useRef,
  useState,
} from "react";
import { Message, ToastCommand, ToastConfig } from "./type";
import { useAutoCallback } from "../../utility-hooks/use-auto-callback";

export const ToastValueContext = createContext<{
  messages: (Message & { id: string })[];
  config: ToastConfig<string>;
}>({
  messages: [],
  config: {
    cases: {},
    defaultDuration: 0,
  },
});

export const ToastCommandContext = createContext<ToastCommand>({
  show: () => {},
  hide: () => {},
});

export function ToastProvider<Type extends string>({
  children,
  config,
}: PropsWithChildren<{ config: ToastConfig<Type> }>) {
  const [messages, setMessages] = useState<(Message & { id: string })[]>([]);
  const configRef = useRef(config);

  const show = useAutoCallback(
    (message: Message, options: { duration: number }) => {
      const { duration } = options;

      const id = Date.now().toString();

      setMessages((prev) => [...prev, { ...message, id }]);

      setTimeout(() => {
        setMessages((prev) => prev.filter((m) => m.id !== id));
      }, duration);
    }
  );

  const hide = useAutoCallback((id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
  });

  const value = useMemo(
    () => ({ messages, config: configRef.current }),
    [messages]
  );
  const commands = useMemo(() => ({ show, hide }), [show, hide]);

  return (
    <ToastValueContext value={value}>
      <ToastCommandContext value={commands}>{children}</ToastCommandContext>
    </ToastValueContext>
  );
}
