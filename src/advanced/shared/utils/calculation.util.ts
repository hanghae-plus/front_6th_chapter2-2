import { CALCULATION } from "@/advanced/shared/constants/calculation";

/**
 * 정액 할인을 적용하여 할인된 가격을 계산합니다.
 * @param originalPrice - 원래 가격
 * @param discountAmount - 할인 금액
 * @returns 할인된 가격 (최소 0원)
 */
export const calculateAmountDiscount = (
  originalPrice: number,
  discountAmount: number
): number => {
  return Math.max(0, originalPrice - discountAmount);
};

/**
 * 정률 할인을 적용하여 할인된 가격을 계산합니다.
 * @param originalPrice - 원래 가격
 * @param discountPercentage - 할인율 (%)
 * @returns 할인된 가격
 */
export const calculatePercentageDiscount = (
  originalPrice: number,
  discountPercentage: number
): number => {
  const discountRate = discountPercentage / CALCULATION.PERCENTAGE_TO_DECIMAL;
  return calculateDiscountedPrice(originalPrice, discountRate);
};

/**
 * 할인율을 적용하여 할인된 가격을 계산합니다.
 * @param originalPrice - 원래 가격
 * @param discountRate - 할인율 (0~1 사이의 소수)
 * @returns 할인된 가격
 */
export const calculateDiscountedPrice = (
  originalPrice: number,
  discountRate: number
): number => {
  return Math.round(
    originalPrice * (CALCULATION.ORIGINAL_PRICE_RATIO - discountRate)
  );
};

/**
 * 할인 금액을 계산합니다.
 * @param originalPrice - 원래 가격
 * @param finalPrice - 할인된 가격
 * @returns 할인 금액
 */
export const calculateDiscountAmount = (
  originalPrice: number,
  finalPrice: number
): number => {
  return originalPrice - finalPrice;
};

/**
 * 할인율(%)을 계산합니다.
 * @param originalPrice - 원래 가격
 * @param finalPrice - 할인된 가격
 * @returns 할인율 (%)
 */
export const calculateDiscountPercentage = (
  originalPrice: number,
  finalPrice: number
): number => {
  if (originalPrice === 0) return 0;

  return Math.round(
    (1 - finalPrice / originalPrice) * CALCULATION.PERCENTAGE_TO_DECIMAL
  );
};

/**
 * 금액 반올림
 * @param amount - 원래 가격
 * @returns 소수점 이하 버림
 */
export const roundAmount = (amount: number): number => {
  return Math.round(amount);
};
