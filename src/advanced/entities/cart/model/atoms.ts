import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import type { Cart } from "../types";

export const cartAtom = atomWithStorage<Cart[]>("cart", []);

export const cartItemCountAtom = atom<number>((get) => {
  const cart = get(cartAtom);
  return cart.reduce((sum, item) => sum + item.quantity, 0);
});
