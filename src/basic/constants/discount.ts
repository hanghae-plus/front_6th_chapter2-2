/**
 * 할인 관련 상수 정의
 */
export const DISCOUNT_CONSTANTS = {
  BULK_PURCHASE_THRESHOLD: 10,
  BULK_PURCHASE_BONUS: 0.05,
  MAX_DISCOUNT_RATE: 0.5,
} as const;

export const COUPON_TYPES = {
  AMOUNT: "amount",
  PERCENTAGE: "percentage",
} as const;
