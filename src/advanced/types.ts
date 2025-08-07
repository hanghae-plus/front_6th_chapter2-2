// UI 관련 타입들
export interface ProductWithUI extends Product {
  description?: string;
  isRecommended?: boolean;
}

export interface Notification {
  id: string;
  message: string;
  type: 'error' | 'success' | 'warning';
}

// 폼 관련 타입들
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
  discountType: 'amount' | 'percentage';
  discountValue: number;
}

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

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Coupon {
  id: string;
  name: string;
  code: string;
  discountType: 'amount' | 'percentage';
  discountValue: number;
}
