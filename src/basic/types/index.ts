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
  name: string;
  code: string;
  discountType: 'amount' | 'percentage';
  discountValue: number;
}

export interface ProductWithUI extends Product {
  description?: string;
  isRecommended?: boolean;
}

export interface Notification {
  id: string;
  message: string;
  type: 'error' | 'success' | 'warning';
}

// Form 타입 정의 추가
export interface ProductForm {
  name: string;
  price: number;
  stock: number;
  description: string;
  discounts: Discount[];
}

export interface CouponForm {
  name: string;
  code: string;
  discountType: 'amount' | 'percentage';
  discountValue: number;
}
