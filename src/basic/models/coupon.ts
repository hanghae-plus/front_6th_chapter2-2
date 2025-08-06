import type { Coupon } from '../../types';
import { applyDiscount } from './discount';

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

interface AddCouponParams {
  newCoupon: Coupon;
  coupons: Coupon[];
  onFailure: (params: { message: string }) => void;
  onSuccess: () => void;
}

// 쿠폰 추가
export function addCoupon({
  newCoupon,
  coupons,
  onFailure,
  onSuccess,
}: AddCouponParams) {
  const existingCoupon = coupons.find(
    (coupon) => coupon.code === newCoupon.code
  );

  if (existingCoupon) {
    onFailure({ message: '이미 존재하는 쿠폰 코드입니다.' });
    return coupons;
  }

  onSuccess();
  return [...coupons, newCoupon];
}

interface DeleteCouponParams {
  coupons: Coupon[];
  couponCode: string;
  onSuccess: () => void;
}

// 쿠폰 삭제
export function deleteCoupon({
  coupons,
  couponCode,
  onSuccess,
}: DeleteCouponParams) {
  onSuccess();
  return coupons.filter((coupon) => coupon.code !== couponCode);
}
