// ========== 비즈니스 로직 상수 ==========

// 재고 임계값
export const LOW_STOCK_THRESHOLD = 5; // 품절 임박 기준
export const MEDIUM_STOCK_THRESHOLD = 10; // 적정 재고 기준

// 할인 표시
export const BULK_PURCHASE_THRESHOLD = 10; // 대량 구매 기준
export const MAX_DISCOUNT_RATE = 0.5; // 최대 할인율 50%
export const BULK_PURCHASE_BONUS = 0.05; // 대량 구매 추가 할인 5%

// 폼 제한값
export const MAX_STOCK_QUANTITY = 9999; // 최대 재고 수량
export const MAX_COUPON_AMOUNT = 100000; // 최대 쿠폰 할인 금액

// 최소 주문 금액
export const MIN_ORDER_AMOUNT_FOR_PERCENTAGE_COUPON = 10000; // 퍼센트 쿠폰 사용 최소 금액