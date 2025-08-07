export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  description?: string;
  discounts: Discount[];
}

export interface ProductWithUI extends Product {
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
  id?: string;
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

// 폼에서 사용할 타입들
export interface ProductFormData {
  name: string;
  price: number;
  stock: number;
  description: string;
  discounts: Discount[];
}

export interface CouponFormData {
  name: string;
  code: string;
  discountType: "amount" | "percentage";
  discountValue: number;
}

// ========== 이벤트 핸들러 타입들 ==========

/**
 * 알림 추가 함수 타입
 */
export type AddNotificationFn = (
  message: string,
  type?: "error" | "success" | "warning"
) => void;
