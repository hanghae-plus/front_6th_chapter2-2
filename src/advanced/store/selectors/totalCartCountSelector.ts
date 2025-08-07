import { atom } from "jotai";
import { cartAtom } from "../atoms/cartAtoms";
import { Getter } from "jotai";

// 장바구니 전체 수량 selector
export const totalCartCountAtom = atom((get: Getter) => {
  const cart = get(cartAtom);
  return cart.reduce((total, item) => total + item.quantity, 0);
});
