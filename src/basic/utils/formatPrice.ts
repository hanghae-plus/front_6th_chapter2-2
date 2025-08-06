import type { CartItem } from "../../types.ts";
import type { ProductWithUI } from "../data/products.ts";
import { getRemainingStock } from "../entities/Product.ts";

// FIXME: make to pure function without side effects
export const formatPrice = (
  price: number,
  productId: string,
  products: ProductWithUI[],
  cart: CartItem[],
  isAdmin: boolean
): string => {
  if (productId) {
    const product = products.find((p) => p.id === productId);
    if (product && getRemainingStock(product, cart) <= 0) {
      return "SOLD OUT";
    }
  }

  if (isAdmin) {
    return `${price.toLocaleString()}원`;
  }

  return `₩${price.toLocaleString()}`;
};
