import { CartItem } from "../../types";
import { ProductWithUI } from "../App";
import { getRemainingStock } from "../models/cart";

export const formatPrice = (price: number) => {
  return price.toLocaleString();
};

export const isProductSoldOut = (
  productId: string,
  products: ProductWithUI[],
  cart: CartItem[]
): boolean => {
  const product = products.find((p) => p.id === productId);

  return product ? getRemainingStock(product, cart) <= 0 : false;
};
