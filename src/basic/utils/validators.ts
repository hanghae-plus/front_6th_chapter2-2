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
