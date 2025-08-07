import { CartItem, Coupon } from '../../../types';

// 장바구니 총액 계산 결과
export interface CartTotal {
  totalBeforeDiscount: number;
  totalAfterDiscount: number;
}

// 장바구니 계산에 필요한 옵션들
export interface CartCalculationOptions {
  cart: CartItem[];
  selectedCoupon?: Coupon | null;
}
