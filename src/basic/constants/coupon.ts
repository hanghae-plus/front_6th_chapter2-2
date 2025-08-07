// 쿠폰 관련 상수

// 할인 타입
export const COUPON_TYPE_AMOUNT = "amount";
export const COUPON_TYPE_PERCENTAGE = "percentage";

// 할인율 제한
export const MAX_PERCENTAGE_DISCOUNT = 100;

// 할인 금액 제한
export const MAX_AMOUNT_DISCOUNT = 100000;

// 정률 할인 최소 주문 금액
export const MIN_ORDER_AMOUNT_FOR_PERCENTAGE = 10000;

// 쿠폰 할인 타입 배열 (타입 체크용)
export const COUPON_DISCOUNT_TYPES = [
  COUPON_TYPE_AMOUNT,
  COUPON_TYPE_PERCENTAGE,
] as const;
