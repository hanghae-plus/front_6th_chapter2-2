import { Coupon } from '../../types';

/**
 * Apply coupon discount to a total price.
 * - amount 쿠폰: 고정 금액 차감, 최소 0원까지
 * - percentage 쿠폰: % 할인 (0~100)
 */
export const applyCouponDiscount = (total: number, coupon: Coupon | null | undefined): number => {
  if (!coupon) return total;

  if (coupon.discountType === 'amount') {
    return Math.max(0, total - coupon.discountValue);
  }

  // percentage 쿠폰: 0~100 범위로 클램프(clamp)
  const clampedRate = Math.min(Math.max(coupon.discountValue, 0), 100);
  return Math.round(total * (1 - clampedRate / 100));
};
