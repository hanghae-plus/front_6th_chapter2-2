import { Provider, createStore } from "jotai";
import { ReactNode } from "react";

const cartStore = createStore();

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  return <Provider store={cartStore}>{children}</Provider>;
}
