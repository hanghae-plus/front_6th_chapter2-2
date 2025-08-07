export type CouponDiscountType = 'amount' | 'percentage';

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  discounts: Discount[];
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
  discountType: CouponDiscountType;
  discountValue: number;
}
export interface NotificationType {
  id: string;
  message: string;
  type: 'error' | 'success' | 'warning';
}

export interface ProductFormType {
  name: string;
  price: number;
  stock: number;
  description: string;
  discounts: Array<{
    quantity: number;
    rate: number;
  }>;
}
export interface CouponFormType {
  name: string;
  code: string;
  discountType: CouponDiscountType;
  discountValue: number;
}
