export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  discounts: Discount[];
}

export interface Discount {
  quantity: number;
  rate: number;
}

// Re-export domain types
export type { CartItem, CartTotals } from "./basic/domains/cart/types";
export type { Coupon } from "./basic/domains/coupon/types";
