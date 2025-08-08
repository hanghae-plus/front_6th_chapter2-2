import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

import type { CartItem } from "../types";

export const cartAtom = atomWithStorage<CartItem[]>("cart", []);

export const totalItemCountAtom = atom((get) => {
  const cart = get(cartAtom);
  return cart.reduce((sum, item) => sum + item.quantity, 0);
});
