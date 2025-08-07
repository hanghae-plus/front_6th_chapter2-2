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
}

// 쿠폰 추가
export function addCoupon({ newCoupon, coupons }: AddCouponParams) {
  const existingCoupon = coupons.find(
    (coupon) => coupon.code === newCoupon.code
  );

  if (existingCoupon) {
    return {
      newCoupons: coupons,
      success: false,
      message: '이미 존재하는 쿠폰 코드입니다.',
    };
  }

  const newCoupons = [...coupons, newCoupon];
  return { newCoupons, success: true, message: '쿠폰이 추가되었습니다' };
}

interface DeleteCouponParams {
  coupons: Coupon[];
  couponCode: string;
}

// 쿠폰 삭제
export function deleteCoupon({ coupons, couponCode }: DeleteCouponParams) {
  const newCoupons = coupons.filter((coupon) => coupon.code !== couponCode);
  return { newCoupons, success: true, message: '쿠폰이 삭제되었습니다' };
}

interface ApplyCouponParams {
  coupon: Coupon;
  prevCoupon: Coupon | null;
  cartTotal: number;
}

export function applyCoupon({
  coupon,
  prevCoupon,
  cartTotal,
}: ApplyCouponParams) {
  if (cartTotal < 10_000 && coupon.discountType === 'percentage') {
    return {
      selectedCoupon: prevCoupon,
      success: false,
      message: 'percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.',
    };
  }

  return {
    selectedCoupon: coupon,
    success: true,
    message: '쿠폰이 적용되었습니다',
  };
}
