// TODO: 검증 유틸리티 함수들
// 구현할 함수:
// - isValidCouponCode(code: string): boolean - 쿠폰 코드 형식 검증 (4-12자 영문 대문자와 숫자)
// - isValidStock(stock: number): boolean - 재고 수량 검증 (0 이상)
// - isValidPrice(price: number): boolean - 가격 검증 (양수)
// - extractNumbers(value: string): string - 문자열에서 숫자만 추출

// 쿠폰 코드 형식 검증 (4-12자 영문 대문자와 숫자)
export function isValidCouponCode(code: string): boolean {
  return /^[A-Z0-9]{4,12}$/.test(code);
}

// 재고 수량 검증 (0 이상)
export function isValidStock(stock: number): boolean {
  return Number.isInteger(stock) && stock >= 0;
}

// 가격 검증 (양수)
export function isValidPrice(price: number): boolean {
  return typeof price === "number" && price > 0;
}

// 문자열에서 숫자만 추출
export function extractNumbers(value: string): string {
  return value.replace(/[^0-9]/g, "");
}
