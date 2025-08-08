import { Provider, createStore } from "jotai";
import { ReactNode } from "react";

const couponStore = createStore();

interface CouponProviderProps {
  children: ReactNode;
}

export function CouponProvider({ children }: CouponProviderProps) {
  return <Provider store={couponStore}>{children}</Provider>;
}
