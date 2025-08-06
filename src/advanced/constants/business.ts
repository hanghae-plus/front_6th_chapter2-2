/**
 * 할인 관련 상수들
 */
export const DISCOUNT = {
  /** 대량 구매 기준 수량 */
  BULK_THRESHOLD: 10,
  /** 대량 구매 추가 할인율 (5%) */
  BULK_BONUS: 0.05,
  /** 최대 할인율 (50%) */
  MAX_RATE: 0.5,
  /** 퍼센트 변환 기준 */
  PERCENTAGE_BASE: 100,
  /** 최대 할인율 (퍼센트) */
  MAX_PERCENTAGE_RATE: 100,
} as const;

/**
 * 쿠폰 관련 상수들
 */
export const COUPON = {
  /** percentage 쿠폰 최소 사용 금액 */
  MIN_AMOUNT_FOR_PERCENTAGE: 10000,
  /** 쿠폰 코드 최소 길이 */
  CODE_MIN_LENGTH: 4,
  /** 쿠폰 코드 최대 길이 */
  CODE_MAX_LENGTH: 12,
  /** 최대 할인 금액 */
  MAX_DISCOUNT_AMOUNT: 100000,
} as const;

/**
 * 재고 관련 상수들
 */
export const STOCK = {
  /** 품절 임박 기준 */
  LOW_STOCK_THRESHOLD: 5,
  /** 재고 상태별 색상 기준 */
  GOOD_STOCK_THRESHOLD: 10,
} as const;

/**
 * 가격 관련 상수들
 */
export const PRICE = {
  /** 최소 가격 */
  MIN_PRICE: 0,
  /** 최대 재고 */
  MAX_STOCK: 9999,
} as const;
