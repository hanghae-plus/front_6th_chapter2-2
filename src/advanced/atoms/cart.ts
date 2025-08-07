import { atom } from "jotai";
import { CartItem } from "../../types";

const getInitialCart = (): Array<CartItem> => {
  try {
    const stored = localStorage.getItem("cart");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// 기본 cart atom
export const cartAtom = atom<Array<CartItem>>([]);

export const cartWithLocalStorageAtom = atom(
  (get) => {
    const currentCart = get(cartAtom);
    if (currentCart.length === 0) {
      return getInitialCart();
    }
    return currentCart;
  },
  (_get, set, newCart: Array<CartItem>) => {
    set(cartAtom, newCart);

    if (newCart.length > 0) {
      localStorage.setItem("cart", JSON.stringify(newCart));
    } else {
      localStorage.removeItem("cart");
    }
  }
);
