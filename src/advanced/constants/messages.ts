/**
 * 애플리케이션 메시지 상수
 */

export const MESSAGES = {
  // 성공 메시지
  SUCCESS: {
    PRODUCT_ADDED: "상품이 추가되었습니다.",
    PRODUCT_UPDATED: "상품이 수정되었습니다.",
    PRODUCT_DELETED: "상품이 삭제되었습니다.",
    COUPON_ADDED: "쿠폰이 추가되었습니다.",
    COUPON_DELETED: "쿠폰이 삭제되었습니다.",
    CART_ADDED: "장바구니에 담았습니다",
    ORDER_COMPLETED: "주문이 완료되었습니다.",
  },

  // 에러 메시지
  ERROR: {
    STOCK_INSUFFICIENT: "재고가 부족합니다!",
    STOCK_EXCEEDED: (stock: number) => `재고는 ${stock}개까지만 있습니다.`,
    COUPON_EXISTS: "이미 존재하는 쿠폰 코드입니다.",
    PRICE_INVALID: "가격은 0보다 커야 합니다",
    STOCK_INVALID: "재고는 0보다 커야 합니다",
    STOCK_MAX_EXCEEDED: (max: number) => `재고는 ${max}개를 초과할 수 없습니다`,
    DISCOUNT_RATE_MAX: (max: number) => `할인율은 ${max}%를 초과할 수 없습니다`,
    DISCOUNT_AMOUNT_MAX: (max: number) =>
      `할인 금액은 ${max.toLocaleString()}원을 초과할 수 없습니다`,
  },

  // 경고 메시지
  WARNING: {
    STOCK_LOW: "재고가 부족합니다",
    CART_EMPTY: "장바구니가 비어있습니다",
  },

  // 정보 메시지
  INFO: {
    SEARCH_NO_RESULTS: "검색 결과가 없습니다",
    LOADING: "로딩 중...",
  },
} as const;
