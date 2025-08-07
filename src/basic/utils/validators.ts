/**
 * 쿠폰 코드 형식 검증 (4-12자 영문 대문자와 숫자)
 */
export const isValidCouponCode = (code: string): boolean => {
  const regex = /^[A-Z0-9]{4,12}$/;
  return regex.test(code);
};

/**
 * 재고 수량 검증
 */
export const isValidStock = (stock: number): boolean => {
  return Number.isInteger(stock) && stock >= 0 && stock <= 9999;
};

/**
 * 가격 검증 (양수)
 */
export const isValidPrice = (price: number): boolean => {
  return Number.isFinite(price) && price > 0;
};

/**
 * 문자열에서 숫자만 추출
 */
export const extractNumbers = (value: string): string => {
  return value.replace(/[^0-9]/g, "");
};

/**
 * 할인값 검증
 */
export const isValidDiscountValue = (
  value: number,
  type: "amount" | "percentage"
): boolean => {
  if (type === "percentage") {
    return value >= 0 && value <= 100;
  }
  return value >= 0 && value <= 100000;
};

/**
 * 재고 상태 분류
 */
export const getStockStatus = (
  stock: number
): "soldOut" | "lowStock" | "inStock" => {
  if (stock <= 0) return "soldOut";
  if (stock <= 5) return "lowStock";
  return "inStock";
};

/**
 * 안전한 숫자 파싱
 */
export const safeParseInt = (
  value: string | number,
  defaultValue: number = 0
): number => {
  if (typeof value === "number")
    return Number.isInteger(value) ? value : defaultValue;
  if (typeof value !== "string") return defaultValue;

  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) ? defaultValue : parsed;
};
