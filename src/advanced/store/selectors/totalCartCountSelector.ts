import { atom } from "jotai";
import { cartAtom } from "../atoms/cartAtoms";

// 장바구니 전체 수량 selector
export const totalCartCountAtom = atom((get) => {
  const cart = get(cartAtom);
  return cart.reduce((total, item) => total + item.quantity, 0);
});
