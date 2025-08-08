/**
 * 장바구니 관련 제약사항
 */
export const CART_CONSTRAINTS = {
  // 수량 관련
  MIN_QUANTITY: 1,
  MAX_QUANTITY: 99,
  MAX_ITEMS: 50, // 최대 장바구니 아이템 수

  // 할인 관련
  BULK_PURCHASE_THRESHOLD: 10, // 대량 구매 기준
  BULK_PURCHASE_DISCOUNT: 0.05, // 5% 추가 할인
  MAX_DISCOUNT_RATE: 0.5, // 최대 50% 할인 제한

  // 재고 관련
  LOW_STOCK_THRESHOLD: 5,
  CRITICAL_STOCK_THRESHOLD: 0,
} as const;

/**
 * 할인 표시 스타일 임계값
 */
export const DISCOUNT_STYLE_THRESHOLDS = {
  HIGH_DISCOUNT: 30, // 30% 이상
  MEDIUM_DISCOUNT: 10, // 10% 이상
} as const;

/**
 * 에러 메시지 상수
 */
export const CART_ERROR_MESSAGES = {
  EMPTY_CART: "장바구니가 비어있습니다",
  OUT_OF_STOCK: "의 재고가 부족합니다.",
  INVALID_QUANTITY: "수량은 1 이상이어야 합니다.",
  MAX_QUANTITY_EXCEEDED: `수량은 ${CART_CONSTRAINTS.MAX_QUANTITY}개를 초과할 수 없습니다.`,
  MAX_ITEMS_EXCEEDED: `장바구니에는 최대 ${CART_CONSTRAINTS.MAX_ITEMS}개 상품만 담을 수 있습니다.`,
  CANNOT_APPLY_COUPON: "쿠폰을 적용할 수 없습니다.",
} as const;
