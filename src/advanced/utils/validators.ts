/**
 * 쿠폰 코드 형식 검증 (4-12자 영문 대문자와 숫자)
 */
export const isValidCouponCode = (code: string): boolean => {
  if (typeof code !== "string") return false;
  const couponCodeRegex = /^[A-Z0-9]{4,12}$/;
  return couponCodeRegex.test(code);
};

/**
 * 재고 수량 검증 (0 이상)
 */
export const isValidStock = (stock: number): boolean => {
  return typeof stock === "number" && stock >= 0 && Number.isInteger(stock);
};

/**
 * 가격 검증 (양수)
 */
export const isValidPrice = (price: number): boolean => {
  return typeof price === "number" && price > 0 && isFinite(price);
};

/**
 * 문자열에서 숫자만 추출
 */
export const extractNumbers = (value: string): string => {
  if (typeof value !== "string") return "";
  return value.replace(/[^0-9]/g, "");
};

/**
 * 할인율 검증 (0-100%)
 */
export const isValidDiscountRate = (rate: number): boolean => {
  return typeof rate === "number" && rate >= 0 && rate <= 100 && isFinite(rate);
};

/**
 * 할인 수량 검증 (1 이상)
 */
export const isValidDiscountQuantity = (quantity: number): boolean => {
  return (
    typeof quantity === "number" && quantity >= 1 && Number.isInteger(quantity)
  );
};
