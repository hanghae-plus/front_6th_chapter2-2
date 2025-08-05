/**
 * 가격을 원, ₩ 형식으로 포맷
 */
export const formatPrice = (
  price: number,
  currency: "won" | "krw" = "krw"
): string => {
  return currency === "won"
    ? `${price.toLocaleString()}원`
    : `₩${price.toLocaleString()}`;
};

/**
 * 소수를 퍼센트로 변환 (0.1 → 10%)
 */
export const formatPercentage = (rate: number): string => {
  return `${Math.round(rate * 100)}%`;
};
