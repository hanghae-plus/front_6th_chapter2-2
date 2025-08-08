import {
  createContext,
  PropsWithChildren,
  useMemo,
  useRef,
  useState,
} from "react";
import { Message, MessageWithId, ToastCommand, ToastConfig } from "./type";
import { useAutoCallback } from "../../utility-hooks/use-auto-callback";

export const ToastValueContext = createContext<{
  messages: MessageWithId[];
  config: ToastConfig;
}>({
  messages: [],
  config: {
    cases: {},
    defaultDuration: 0,
  },
});

export const ToastCommandContext = createContext<ToastCommand>({
  show: () => {
    throw new Error("useToast must be used within a ToastProvider");
  },
  hide: () => {
    throw new Error("useToast must be used within a ToastProvider");
  },
});

export function ToastProvider<Type extends string>({
  children,
  config,
}: PropsWithChildren<{ config: ToastConfig<Type> }>) {
  const [messages, setMessages] = useState<MessageWithId<Type>[]>([]);
  const configRef = useRef(config);

  const show = useAutoCallback(
    (message: Message<Type>, options: { duration: number }) => {
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
    () => ({ 
      messages: messages as unknown as MessageWithId[], 
      config: configRef.current as unknown as ToastConfig 
    }),
    [messages]
  );
  const commands = useMemo(() => ({ 
    show: show as unknown as ToastCommand['show'], 
    hide 
  }), [show, hide]);

  return (
    <ToastValueContext value={value}>
      <ToastCommandContext value={commands}>{children}</ToastCommandContext>
    </ToastValueContext>
  );
}
