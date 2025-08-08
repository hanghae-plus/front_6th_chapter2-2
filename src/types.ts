export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  discounts: Array<{ quantity: number; rate: number }>;
}

export interface ProductWithUI extends Product {
  description?: string;
  isRecommended?: boolean;
}

export interface Coupon {
  name: string;
  code: string;
  discountType: "amount" | "percentage";
  discountValue: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Notification {
  id: string;
  message: string;
  type: "error" | "success" | "warning";
}

export interface Toast {
  id: string;
  message: string;
  type: "error" | "success" | "warning";
}
