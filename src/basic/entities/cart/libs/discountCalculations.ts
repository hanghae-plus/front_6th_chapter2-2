import { calculateDiscountedPrice } from "@shared/libs/price";

/**
 * 수량에 따른 최대 할인율을 찾는 함수
 */
export const findMaxDiscountByQuantity = (
  quantity: number,
  discounts: Array<{ quantity: number; rate: number }>
): number => {
  return discounts.reduce((maxDiscount, discount) => {
    return quantity >= discount.quantity && discount.rate > maxDiscount
      ? discount.rate
      : maxDiscount;
  }, 0);
};

/**
 * 조건에 따른 보너스 할인율 계산
 */
export const calculateBonusDiscount = (
  baseDiscount: number,
  hasBonus: boolean,
  bonusAmount: number = 0.05,
  maxDiscount: number = 0.5
): number => {
  if (!hasBonus) return baseDiscount;
  return Math.min(Math.max(baseDiscount + bonusAmount, 0), maxDiscount);
};

/**
 * 배열의 특정 조건을 만족하는 항목이 있는지 확인
 */
export const hasItemWithMinQuantity = (
  items: Array<{ quantity: number }>,
  minQuantity: number
): boolean => {
  return items.some((item) => item.quantity >= minQuantity);
};

/**
 * 가격과 수량으로 총액 계산 (할인 적용)
 */
export const calculateTotalWithDiscount = (
  price: number,
  quantity: number,
  discountRate: number
): number => {
  const discountedPrice = calculateDiscountedPrice(price, discountRate * 100);
  return Math.round(discountedPrice * quantity);
};
