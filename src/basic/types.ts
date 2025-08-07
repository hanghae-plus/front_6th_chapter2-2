export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  discounts: Discount[];
}

export interface ProductWithUI extends Product {
  description?: string;
  isRecommended?: boolean;
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

export interface Notification {
  id: string;
  message: string;
  type: "error" | "success" | "warning";
}

// admin
export interface ProductFormData {
  name: string;
  price: number;
  stock: number;
  description: string;
  discounts: Array<{ quantity: number; rate: number }>;
}

export interface CouponFormData {
  name: string;
  code: string;
  discountType: "amount" | "percentage";
  discountValue: number;
}
