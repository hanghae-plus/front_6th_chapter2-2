import { useAtom, useAtomValue } from "jotai";
import { calculateItemTotal } from "@entities/cart/libs";
import { cartAtom, cartItemCountAtom } from "../model/atoms";
import type { Cart } from "../types";

export function useCart() {
  const [cart, setCart] = useAtom(cartAtom);
  const cartItemCount = useAtomValue(cartItemCountAtom);

  const getItemTotal = (item: Cart) => calculateItemTotal(item, cart);

  const addItem = (item: Cart) => {
    const existingIndex = cart.findIndex((cartItem) => cartItem.id === item.id);

    if (existingIndex >= 0) {
      const newCart = [...cart];
      newCart[existingIndex] = {
        ...newCart[existingIndex],
        quantity: newCart[existingIndex].quantity + item.quantity,
      };
      setCart(newCart);
    } else {
      setCart([...cart, item]);
    }
  };

  const removeItem = (productId: string) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  const updateItemQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    setCart(
      cart.map((item) => (item.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  return {
    cart,
    getItemTotal,
    cartItemCount,
    addItem,
    removeItem,
    updateItemQuantity,
    clearCart,
  };
}
