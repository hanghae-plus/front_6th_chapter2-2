import { Provider, createStore } from "jotai";
import { ReactNode } from "react";

const notificationStore = createStore();

interface NotificationProviderProps {
  children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  return <Provider store={notificationStore}>{children}</Provider>;
}
