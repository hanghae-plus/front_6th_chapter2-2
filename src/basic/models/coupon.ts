import type { Coupon } from '../../types';
import { applyDiscount } from '../utils/discount';

type CouponApplier = (params: { price: number }) => number;

type CouponRecord = Record<Coupon['discountType'], CouponApplier>;

export function getCouponApplier({
  coupon,
}: {
  coupon: Coupon | null;
}): CouponApplier {
  if (!coupon) {
    return ({ price }) => price;
  }

  const { discountType, discountValue } = coupon;

  const couponRecord: CouponRecord = {
    amount: ({ price }) => {
      return Math.max(0, price - discountValue);
    },
    percentage: ({ price }) => {
      return applyDiscount({ price, discount: discountValue / 100 });
    },
  };

  return couponRecord[discountType];
}
