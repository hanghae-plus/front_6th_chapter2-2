// 할인 관련 비즈니스 로직 (순수 함수)
import { Discount, CartItem } from "../type/types";
import { isValidDiscountRate, isValidQuantity } from "../utils/validators";

/**
 * 할인 규칙의 유효성을 검증합니다
 * @param discount 검증할 할인 규칙
 * @returns 유효한 할인 규칙이면 true, 그렇지 않으면 false
 */
export function isValidDiscount(discount: Discount): boolean {
  return (
    isValidQuantity(discount.quantity) && isValidDiscountRate(discount.rate)
  );
}

/**
 * 할인 규칙 배열의 유효성을 검증합니다
 * @param discounts 검증할 할인 규칙 배열
 * @returns 유효한 할인 규칙 배열이면 true, 그렇지 않으면 false
 */
export function isValidDiscountList(discounts: Discount[]): boolean {
  // 모든 할인 규칙이 유효해야 함
  if (!discounts.every(isValidDiscount)) {
    return false;
  }

  // 중복된 수량이 없어야 함
  const quantities = discounts.map((d) => d.quantity);
  return new Set(quantities).size === quantities.length;
}

/**
 * 특정 수량에 대해 적용 가능한 최대 할인율을 계산합니다
 * @param discounts 할인 규칙 배열
 * @param quantity 구매 수량
 * @returns 적용 가능한 최대 할인율 (0~1 사이 값)
 */
export function getBaseDiscountRate(
  discounts: Discount[],
  quantity: number
): number {
  return discounts.reduce((maxRate, discount) => {
    return quantity >= discount.quantity && discount.rate > maxRate
      ? discount.rate
      : maxRate;
  }, 0);
}

/**
 * 대량 구매 할인이 적용되는지 확인합니다
 * @param cart 장바구니 아이템 배열
 * @param threshold 대량 구매 기준 수량 (기본값: 10)
 * @returns 대량 구매 할인 적용 여부
 */
export function hasBulkPurchaseDiscount(
  cart: CartItem[],
  threshold: number = 10
): boolean {
  return cart.some((item) => item.quantity >= threshold);
}

/**
 * 대량 구매 할인을 포함한 최종 할인율을 계산합니다
 * @param discounts 상품의 할인 규칙 배열
 * @param quantity 해당 상품의 구매 수량
 * @param cart 전체 장바구니 (대량 구매 할인 확인용)
 * @param bulkDiscountRate 대량 구매 시 추가 할인율 (기본값: 0.05 = 5%)
 * @param maxDiscountRate 최대 할인율 (기본값: 0.5 = 50%)
 * @returns 최종 할인율 (0~1 사이 값)
 */
export function getMaxApplicableDiscountRate(
  discounts: Discount[],
  quantity: number,
  cart: CartItem[],
  bulkDiscountRate: number = 0.05,
  maxDiscountRate: number = 0.5
): number {
  // 기본 할인율 계산
  const baseDiscount = getBaseDiscountRate(discounts, quantity);

  // 대량 구매 할인 확인
  if (hasBulkPurchaseDiscount(cart)) {
    return Math.min(baseDiscount + bulkDiscountRate, maxDiscountRate);
  }

  return baseDiscount;
}

/**
 * 할인이 적용된 가격을 계산합니다
 * @param originalPrice 원래 가격
 * @param discountRate 할인율 (0~1 사이 값)
 * @returns 할인 적용 후 가격
 */
export function applyDiscountToPrice(
  originalPrice: number,
  discountRate: number
): number {
  return Math.round(originalPrice * (1 - discountRate));
}

/**
 * 할인 금액을 계산합니다
 * @param originalPrice 원래 가격
 * @param discountRate 할인율 (0~1 사이 값)
 * @returns 할인 금액
 */
export function calculateDiscountAmount(
  originalPrice: number,
  discountRate: number
): number {
  return Math.round(originalPrice * discountRate);
}

/**
 * 할인 규칙을 수량 기준으로 정렬합니다
 * @param discounts 정렬할 할인 규칙 배열
 * @returns 수량 기준으로 정렬된 할인 규칙 배열
 */
export function sortDiscountsByQuantity(discounts: Discount[]): Discount[] {
  return [...discounts].sort((a, b) => a.quantity - b.quantity);
}

/**
 * 새로운 할인 규칙을 추가합니다
 * @param discounts 기존 할인 규칙 배열
 * @param newDiscount 추가할 할인 규칙
 * @returns 할인 규칙이 추가된 새로운 배열 또는 null (유효하지 않거나 중복인 경우)
 */
export function addDiscount(
  discounts: Discount[],
  newDiscount: Discount
): Discount[] | null {
  if (!isValidDiscount(newDiscount)) {
    return null;
  }

  // 같은 수량의 할인 규칙이 이미 있는지 확인
  if (discounts.some((d) => d.quantity === newDiscount.quantity)) {
    return null;
  }

  return sortDiscountsByQuantity([...discounts, newDiscount]);
}

/**
 * 특정 수량의 할인 규칙을 제거합니다
 * @param discounts 기존 할인 규칙 배열
 * @param quantity 제거할 할인 규칙의 수량
 * @returns 할인 규칙이 제거된 새로운 배열
 */
export function removeDiscount(
  discounts: Discount[],
  quantity: number
): Discount[] {
  return discounts.filter((d) => d.quantity !== quantity);
}

/**
 * 특정 수량의 할인 규칙을 업데이트합니다
 * @param discounts 기존 할인 규칙 배열
 * @param quantity 업데이트할 할인 규칙의 수량
 * @param newRate 새로운 할인율
 * @returns 업데이트된 할인 규칙 배열 또는 null (유효하지 않은 경우)
 */
export function updateDiscountRate(
  discounts: Discount[],
  quantity: number,
  newRate: number
): Discount[] | null {
  if (!isValidDiscountRate(newRate)) {
    return null;
  }

  const discountExists = discounts.some((d) => d.quantity === quantity);
  if (!discountExists) {
    return null;
  }

  return discounts.map((d) =>
    d.quantity === quantity ? { ...d, rate: newRate } : d
  );
}

/**
 * 할인율을 퍼센트 문자열로 포맷합니다
 * @param rate 할인율 (0~1 사이 값)
 * @returns 퍼센트 문자열 (예: "10%")
 */
export function formatDiscountRate(rate: number): string {
  return `${Math.round(rate * 100)}%`;
}

/**
 * 특정 수량에서 다음 할인 단계까지 필요한 수량을 계산합니다
 * @param discounts 할인 규칙 배열
 * @param currentQuantity 현재 수량
 * @returns 다음 할인까지 필요한 수량 또는 null (다음 할인이 없는 경우)
 */
export function getQuantityToNextDiscount(
  discounts: Discount[],
  currentQuantity: number
): number | null {
  const sortedDiscounts = sortDiscountsByQuantity(discounts);

  for (const discount of sortedDiscounts) {
    if (discount.quantity > currentQuantity) {
      return discount.quantity - currentQuantity;
    }
  }

  return null; // 더 이상 할인 단계가 없음
}

/**
 * 현재 수량에서 적용되는 할인 정보를 가져옵니다
 * @param discounts 할인 규칙 배열
 * @param quantity 현재 수량
 * @returns 현재 적용되는 할인 규칙 또는 null
 */
export function getCurrentDiscount(
  discounts: Discount[],
  quantity: number
): Discount | null {
  const applicableDiscounts = discounts.filter((d) => quantity >= d.quantity);

  if (applicableDiscounts.length === 0) {
    return null;
  }

  return applicableDiscounts.reduce((maxDiscount, discount) =>
    discount.rate > maxDiscount.rate ? discount : maxDiscount
  );
}
