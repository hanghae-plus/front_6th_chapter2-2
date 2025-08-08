/**
 * 쿠폰 코드 형식 검증
 * @param code - 검증할 쿠폰 코드
 * @returns 유효성 여부 (4-12자 영문 대문자와 숫자)
 */
export function isValidCouponCode(code: string): boolean {
  // 타입 검증
  if (typeof code !== "string") {
    return false;
  }

  // 빈 문자열 체크
  if (!code.trim()) {
    return false;
  }

  // 4-12자 영문 대문자와 숫자만 허용
  const couponCodeRegex = /^[A-Z0-9]{4,12}$/;
  return couponCodeRegex.test(code.trim());
}

/**
 * 재고 수량 검증
 * @param stock - 검증할 재고 수량
 * @returns 유효성 여부 (0 이상의 정수)
 */
export function isValidStock(stock: number): boolean {
  // 타입 검증
  if (typeof stock !== "number" || isNaN(stock)) {
    return false;
  }

  // 0 이상의 정수인지 확인
  return stock >= 0 && Number.isInteger(stock);
}

/**
 * 가격 검증
 * @param price - 검증할 가격
 * @returns 유효성 여부 (양수)
 */
export function isValidPrice(price: number): boolean {
  // 타입 검증
  if (typeof price !== "number" || isNaN(price)) {
    return false;
  }

  // 양수이고 무한대가 아닌지 확인
  return price > 0 && isFinite(price);
}

/**
 * 문자열에서 숫자만 추출
 * @param value - 처리할 문자열
 * @returns 숫자만 포함된 문자열
 */
export function extractNumbers(value: string): string {
  // 타입 검증
  if (typeof value !== "string") {
    return "";
  }

  // 숫자만 추출 (정규식 사용)
  return value.replace(/[^0-9]/g, "");
}

// 추가 유틸리티 함수들 (보너스)

/**
 * 상품명 검증
 * @param name - 검증할 상품명
 * @returns 유효성 여부 (1-50자)
 */
export function isValidProductName(name: string): boolean {
  if (typeof name !== "string") {
    return false;
  }

  const trimmedName = name.trim();
  return trimmedName.length >= 1 && trimmedName.length <= 50;
}

/**
 * 할인율 검증
 * @param rate - 검증할 할인율 (0.1 = 10%)
 * @returns 유효성 여부 (0-1 사이)
 */
export function isValidDiscountRate(rate: number): boolean {
  if (typeof rate !== "number" || isNaN(rate)) {
    return false;
  }

  return rate >= 0 && rate <= 1;
}

/**
 * 수량 검증
 * @param quantity - 검증할 수량
 * @returns 유효성 여부 (1 이상의 정수)
 */
export function isValidQuantity(quantity: number): boolean {
  if (typeof quantity !== "number" || isNaN(quantity)) {
    return false;
  }

  return quantity >= 1 && Number.isInteger(quantity);
}

/**
 * 이메일 형식 검증
 * @param email - 검증할 이메일
 * @returns 유효성 여부
 */
export function isValidEmail(email: string): boolean {
  if (typeof email !== "string") {
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * 숫자 문자열을 실제 숫자로 변환 (안전하게)
 * @param value - 변환할 문자열
 * @param defaultValue - 기본값
 * @returns 변환된 숫자
 */
export function safeParseNumber(
  value: string,
  defaultValue: number = 0
): number {
  if (typeof value !== "string") {
    return defaultValue;
  }

  const parsed = parseFloat(value);
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * 정수 문자열을 실제 정수로 변환 (안전하게)
 * @param value - 변환할 문자열
 * @param defaultValue - 기본값
 * @returns 변환된 정수
 */
export function safeParseInt(value: string, defaultValue: number = 0): number {
  if (typeof value !== "string") {
    return defaultValue;
  }

  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}
