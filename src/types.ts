export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  discounts: Discount[];
}

export interface ProductForm {
  name: string;
  price: number;
  stock: number;
  description: string;
  discounts: Array<{
    quantity: number;
    rate: number;
  }>;
}

export interface Discount {
  quantity: number;
  rate: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Coupon {
  name: string;
  code: string;
  discountType: "amount" | "percentage";
  discountValue: number;
}

export interface CouponForm extends Coupon {}

export interface ProductWithUI extends Product {
  description?: string;
  isRecommended?: boolean;
}

export interface Notification {
  id: string;
  message: string;
  type: "error" | "success" | "warning";
}

export type AddNotification = (
  message: string,
  type?: "error" | "success" | "warning"
) => void;
