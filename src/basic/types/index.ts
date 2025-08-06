import { Product } from "../../types";

export interface ProductWithUI extends Product {
  description?: string;
  isRecommended?: boolean;
}

export interface Notification {
  id: string;
  message: string;
  type: "error" | "success" | "warning";
}

export interface ProductForm {
  name: string;
  price: number;
  stock: number;
  description: string;
  discounts: Array<{ quantity: number; rate: number }>;
}

export interface CouponForm {
  name: string;
  code: string;
  discountType: "amount" | "percentage";
  discountValue: number;
}

export interface CartTotals {
  totalBeforeDiscount: number;
  totalAfterDiscount: number;
}

export type DiscountInfo = {
  quantity: number;
  rate: number;
};
