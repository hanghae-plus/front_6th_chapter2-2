// 상품 재고 관련 상수들
export const PRODUCT_CONSTANTS = {
  // 상품 재고가 이 값 이하일 때 "품절임박" 메시지를 표시
  LOW_STOCK_THRESHOLD: 5,
  // 재고가 없을 때의 값
  OUT_OF_STOCK: 0,
} as const;
