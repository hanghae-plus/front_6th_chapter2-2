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

export const toPercentage = (decimal: number): number => {
  return decimal * 100;
};

export const toDecimal = (percentage: number): number => {
  return percentage / 100;
};

export const calculateDiscountRate = (
  original: number,
  discounted: number
): number => {
  return Math.round((1 - discounted / original) * 100);
};
