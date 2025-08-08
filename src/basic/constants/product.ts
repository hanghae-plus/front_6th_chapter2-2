/**
 * 상품 관련 제약사항
 */
export const PRODUCT_CONSTRAINTS = {
  // 가격 관련
  MIN_PRICE: 0,
  MAX_PRICE: 10_000_000, // 1천만원

  // 재고 관련
  MIN_STOCK: 0,
  MAX_STOCK: 9999,

  // 상품명 관련
  MIN_NAME_LENGTH: 1,
  MAX_NAME_LENGTH: 50,

  // 설명 관련
  MAX_DESCRIPTION_LENGTH: 500,

  // 할인 관련
  MAX_DISCOUNTS: 5,
  MIN_DISCOUNT_RATE: 0.01, // 1%
  MAX_DISCOUNT_RATE: 1.0, // 100%
  MIN_DISCOUNT_QUANTITY: 1,
  MAX_DISCOUNT_QUANTITY: 999,
} as const;

/**
 * 상품 표시 관련 상수
 */
export const PRODUCT_DISPLAY = {
  // 재고 임계값
  LOW_STOCK_THRESHOLD: 5,
  CRITICAL_STOCK_THRESHOLD: 0,
  NORMAL_STOCK_THRESHOLD: 10,

  // 할인 표시 임계값
  MIN_DISCOUNT_FOR_BADGE: 0.1, // 10% 이상만 배지 표시

  // 추천 상품 배지
  RECOMMENDED_BADGE_TEXT: "BEST",
  RECOMMENDED_BADGE_STYLE: "bg-red-500 text-white text-xs px-2 py-1 rounded",

  // 할인 배지
  DISCOUNT_BADGE_STYLE: "bg-orange-500 text-white text-xs px-2 py-1 rounded",
} as const;

/**
 * 재고 상태별 스타일
 */
export const STOCK_STATUS_STYLES = {
  NORMAL: "bg-green-100 text-green-800", // 10개 초과
  LOW: "bg-yellow-100 text-yellow-800", // 1-10개
  OUT_OF_STOCK: "bg-red-100 text-red-800", // 0개
} as const;

/**
 * 에러 메시지 상수
 */
export const PRODUCT_ERROR_MESSAGES = {
  // 입력 관련
  ONLY_NUMBERS: "숫자만 입력 가능합니다",

  // 가격 관련
  PRICE_REQUIRED: "가격은 0보다 커야 합니다",
  PRICE_INVALID: "가격은 0보다 큰 숫자여야 합니다",

  // 재고 관련
  STOCK_REQUIRED: "재고는 0보다 커야 합니다",
  STOCK_OVER_MAX: "재고는 9999개를 초과할 수 없습니다",

  // 상품명 관련
  NAME_REQUIRED: "상품명을 입력해주세요",
  NAME_TOO_LONG: "상품명은 50자 이하여야 합니다",
} as const;
