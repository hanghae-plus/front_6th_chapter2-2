import { Coupon } from '../../types';
import { initialCoupons } from '../constants';

export const loadCouponsFromStorage = (): Coupon[] => {
  const saved = localStorage.getItem('coupons');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return initialCoupons;
    }
  }
  return initialCoupons;
};

export const saveCouponsToStorage = (coupons: Coupon[]): void => {
  localStorage.setItem('coupons', JSON.stringify(coupons));
};

export const addNewCoupon = (coupons: Coupon[], newCoupon: Coupon): Coupon[] => {
  const existingCoupon = coupons.find((c) => c.code === newCoupon.code);
  if (existingCoupon) {
    throw new Error('이미 존재하는 쿠폰 코드입니다.');
  }
  return [...coupons, newCoupon];
};

export const removeCouponByCode = (coupons: Coupon[], couponCode: string): Coupon[] => {
  return coupons.filter((c) => c.code !== couponCode);
};
