import { Product, CartItem } from "../types";

export function getRemainingStock(product: Product, cart: CartItem[]): number {
  const cartItem = cart.find((item) => item.product.id === product.id);
  const remaining = product.stock - (cartItem?.quantity || 0);

  return remaining;
}
