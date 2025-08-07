export const MESSAGES = {
  COUPON: {
    ADDED: '쿠폰이 추가되었습니다.',
    DELETED: '쿠폰이 삭제되었습니다.',

    APPLIED: '쿠폰이 적용되었습니다.',
    ALREADY_EXISTS: '이미 존재하는 쿠폰 코드입니다.',
    MIN_PRICE: 'percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.',
  },

  PRODUCT: {
    ADDED: '상품이 추가되었습니다.',
    UPDATED: '상품이 수정되었습니다.',
    DELETED: '상품이 삭제되었습니다.',

    OUT_OF_STOCK: '재고가 부족합니다!',
    MAX_STOCK: (maxStock: number) => `재고는 ${maxStock}개까지만 있습니다.`,
    ADDED_TO_CART: '장바구니에 담았습니다',
    LOW_STOCK: (remainingStock: number) => `품절임박! ${remainingStock}개 남음`,
    INVALID_QUANTITY: '수량은 0 이상의 정수여야 합니다.',
  },

  ORDER: {
    COMPLETED: (orderNumber: string) => `주문이 완료되었습니다. 주문번호: ${orderNumber}`,
  },

  STOCK: {
    MIN: '재고는 0보다 커야 합니다',
    MAX: '재고는 9999개를 초과할 수 없습니다',
  },

  PRICE: {
    MIN: '가격은 0보다 커야 합니다',
  },

  DISCOUNT_PERCENTAGE: {
    MIN: '할인율은 0% 이상이어야 합니다',
    MAX: '할인율은 100%를 초과할 수 없습니다',
  },

  DISCOUNT_AMOUNT: {
    MIN: '할인 금액은 0원 이상이어야 합니다',
    MAX: '할인 금액은 100,000원을 초과할 수 없습니다',
  },
} as const;
