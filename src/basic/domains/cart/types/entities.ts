import type { Product } from "../../../../types";

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartTotals {
  totalBeforeDiscount: number;
  totalAfterDiscount: number;
}
