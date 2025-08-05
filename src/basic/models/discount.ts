import { Discount } from '../../types';

// 할인 비즈니스 로직 (순수 함수)
// 모든 함수는 순수 함수로 구현 (부작용 없음, 같은 입력에 항상 같은 출력)
//
// 구현할 함수들:
// 1. hasDiscount(itemTotal, originalPrice): 할인 적용 여부 확인
// 2. calculateDiscountRate(itemTotal, originalPrice): 할인율 계산
// 3. getMaxDiscountRate(discounts): 최대 할인율 계산
// 4. formatDiscountDescription(discounts): 할인 설명 포맷
// 5. hasTotalDiscount(totalBeforeDiscount, totalAfterDiscount): 총 할인 여부 확인
// 6. calculateTotalDiscountAmount(totalBeforeDiscount, totalAfterDiscount): 총 할인액 계산
//
// 원칙:
// - UI와 관련된 로직 없음
// - 외부 상태에 의존하지 않음
// - 모든 필요한 데이터는 파라미터로 전달받음

// TODO: 구현

// 1. hasDiscount(itemTotal, originalPrice): 할인 적용 여부 확인
// 2. calculateDiscountRate(itemTotal, originalPrice): 할인율 계산
// 3. getMaxDiscountRate(discounts): 최대 할인율 계산
export const getMaxDiscountRate = (discounts: Discount[]): number => {
  if (discounts.length === 0) return 0;
  return Math.max(...discounts.map((d) => d.rate)) * 100;
};

// 4. formatDiscountDescription(discounts): 할인 설명 포맷
export const formatDiscountDescription = (discounts: Discount[]): string => {
  const [firstDiscount] = discounts;
  if (!firstDiscount) return '';
  return `${firstDiscount.quantity}개 이상 구매시 할인 ${firstDiscount.rate * 100}%`;
};

// 5. hasTotalDiscount(totalBeforeDiscount, totalAfterDiscount): 총 할인 여부 확인
export const hasTotalDiscount = (
  totalBeforeDiscount: number,
  totalAfterDiscount: number
): boolean => {
  return totalBeforeDiscount - totalAfterDiscount > 0;
};

// 6. calculateTotalDiscountAmount(totalBeforeDiscount, totalAfterDiscount): 총 할인액 계산
export const calculateTotalDiscountAmount = (
  totalBeforeDiscount: number,
  totalAfterDiscount: number
): number => {
  return totalBeforeDiscount - totalAfterDiscount;
};

// 1. hasDiscount(itemTotal, originalPrice): 할인 적용 여부 확인
export const hasDiscount = (itemTotal: number, originalPrice: number): boolean => {
  return itemTotal < originalPrice;
};

// 2. calculateDiscountRate(itemTotal, originalPrice): 할인율 계산
export const calculateDiscountRate = (itemTotal: number, originalPrice: number): number => {
  return hasDiscount(itemTotal, originalPrice)
    ? Math.round((1 - itemTotal / originalPrice) * 100)
    : 0;
};
