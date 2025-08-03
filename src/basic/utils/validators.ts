import { Product } from "../types";

// TODO: 검증 유틸리티 함수들
// 구현할 함수:
// - isValidCouponCode(code: string): boolean - 쿠폰 코드 형식 검증 (4-12자 영문 대문자와 숫자)
// - isValidStock(stock: number): boolean - 재고 수량 검증 (0 이상)
// - isValidPrice(price: number): boolean - 가격 검증 (양수)
// - extractNumbers(value: string): string - 문자열에서 숫자만 추출

// TODO: 구현

export function validateCartStock(product: Product, requestedQuantity: number) {
  if (requestedQuantity > product.stock) {
    return {
      isValid: false,
      errorMessage: `재고는 ${product.stock}개까지만 있습니다.`,
    };
  }

  return { isValid: true, errorMessage: undefined };
}
