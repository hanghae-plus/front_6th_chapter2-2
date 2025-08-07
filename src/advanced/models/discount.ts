export interface Discount {
  quantity: number;
  rate: number;
}

/**
 * 기본 할인 정보 생성
 */
const createDefaultDiscount = (): Discount => ({ quantity: 10, rate: 0.1 });

// ============================================================================
// 할인 목록 조작 함수들
// ============================================================================

/**
 * 할인 목록에 새 할인 추가
 */
export const addDiscountToList = (discounts: Discount[]): Discount[] => [
  ...discounts,
  createDefaultDiscount(),
];

/**
 * 할인 목록에서 특정 인덱스 할인 제거
 */
export const removeDiscountFromList = (
  discounts: Discount[],
  index: number
): Discount[] => discounts.filter((_, i) => i !== index);

// ============================================================================
// 할인 검증 함수들
// ============================================================================

/**
 * 할인 정보가 유효한지 검증
 */
export const isValidDiscount = (discount: Discount): boolean =>
  discount.quantity > 0 && discount.rate > 0 && discount.rate <= 1;

/**
 * 할인 목록에서 유효한 할인들만 필터링
 */
export const filterValidDiscounts = (discounts: Discount[]): Discount[] =>
  discounts.filter(isValidDiscount);

/**
 * 빈 할인 목록 생성
 */
export const createEmptyDiscountList = (): Discount[] => [];

/**
 * 기본 할인 목록 생성 (1개 기본 할인 포함)
 */
export const createDefaultDiscountList = (): Discount[] => [
  createDefaultDiscount(),
];
