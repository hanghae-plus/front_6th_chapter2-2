import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { CartItem } from "../../types";

// 장바구니 아이템들 (localStorage 연동)
export const cartAtom = atomWithStorage<CartItem[]>("cart", []);

// 장바구니 총 아이템 개수 (파생 상태)
export const totalItemCountAtom = atom((get) => {
  const cart = get(cartAtom);
  return cart.reduce((sum, item) => sum + item.quantity, 0);
});
