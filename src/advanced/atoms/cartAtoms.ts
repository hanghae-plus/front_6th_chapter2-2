import { atom } from "jotai";
import { CartItem } from "../../types";
import { loadDataFromStorage } from "../utils/localStorageUtils";

// localStorage에서 초기값 로드
const initialCart = loadDataFromStorage<CartItem[]>("cart", []);

/** 장바구니 상태 */
export const cartAtom = atom<CartItem[]>(initialCart);

/** 장바구니 아이템 수 */
export const totalItemCountAtom = atom<number>((get) => {
  const cart = get(cartAtom);
  return cart.reduce((total, item) => total + item.quantity, 0);
});
