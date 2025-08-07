// 성공 메시지
export const SUCCESS_MESSAGES = {
  PRODUCT_ADDED: "상품이 추가되었습니다.",
  PRODUCT_UPDATED: "상품이 수정되었습니다.",
  PRODUCT_DELETED: "상품이 삭제되었습니다.",
  COUPON_ADDED: "쿠폰이 추가되었습니다.",
  COUPON_DELETED: "쿠폰이 삭제되었습니다.",
  COUPON_APPLIED: "쿠폰이 적용되었습니다.",
  ITEM_ADDED_TO_CART: "장바구니에 담았습니다",
  ORDER_COMPLETED: (orderNumber: string) =>
    `주문이 완료되었습니다. 주문번호: ${orderNumber}`,
} as const;

// 에러 메시지
export const ERROR_MESSAGES = {
  STOCK_INSUFFICIENT: "재고가 부족합니다!",
  STOCK_EXCEEDED: (maxStock: number) => `재고는 ${maxStock}개까지만 있습니다.`,
  STOCK_LIMIT_EXCEEDED: "재고는 9999개를 초과할 수 없습니다",
  DISCOUNT_RATE_EXCEEDED: "할인율은 100%를 초과할 수 없습니다",
  DISCOUNT_RATE_BELOW_ZERO: "할인율은 0 이상이어야 합니다",
  DISCOUNT_AMOUNT_EXCEEDED: "할인 금액은 100,000원을 초과할 수 없습니다",
  DISCOUNT_AMOUNT_BELOW_ZERO: "할인 금액은 0 이상이어야 합니다",
  PRICE_BELOW_ZERO: "가격은 0보다 커야 합니다",
  COUPON_UNAVAILABLE: "쿠폰을 사용할 수 없습니다.",
  COUPON_MIN_PURCHASE_REQUIRED:
    "percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.",
} as const;
