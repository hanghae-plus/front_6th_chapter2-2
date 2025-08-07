import { Discount } from '../../types';

// 할인 비즈니스 로직 (순수 함수)

// 최대 할인율 계산
export const getMaxDiscountRate = (discounts: Discount[]): number => {
  if (discounts.length === 0) return 0;
  return Math.max(...discounts.map((d) => d.rate)) * 100;
};

// 할인 설명 포맷
export const formatDiscountDescription = (discounts: Discount[]): string => {
  const [firstDiscount] = discounts;
  if (!firstDiscount) return '';
  return `${firstDiscount.quantity}개 이상 구매시 할인 ${firstDiscount.rate * 100}%`;
};

// 총 할인 여부 확인
export const hasTotalDiscount = (
  totalBeforeDiscount: number,
  totalAfterDiscount: number
): boolean => {
  return totalBeforeDiscount - totalAfterDiscount > 0;
};

// 총 할인액 계산
export const calculateTotalDiscountAmount = (
  totalBeforeDiscount: number,
  totalAfterDiscount: number
): number => {
  return totalBeforeDiscount - totalAfterDiscount;
};

// 할인 적용 여부 확인
export const hasDiscount = (itemTotal: number, originalPrice: number): boolean => {
  return itemTotal < originalPrice;
};

// 할인율 계산
export const calculateDiscountRate = (itemTotal: number, originalPrice: number): number => {
  return hasDiscount(itemTotal, originalPrice)
    ? Math.round((1 - itemTotal / originalPrice) * 100)
    : 0;
};
