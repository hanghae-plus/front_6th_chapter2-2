import { Provider, createStore } from "jotai";
import { ReactNode } from "react";

const productStore = createStore();

interface ProductProviderProps {
  children: ReactNode;
}

export function ProductProvider({ children }: ProductProviderProps) {
  return <Provider store={productStore}>{children}</Provider>;
}
