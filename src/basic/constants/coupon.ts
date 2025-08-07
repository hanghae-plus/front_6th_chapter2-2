import type { Coupon } from '../../types';

export const initialCoupons: Coupon[] = [
  {
    name: '5000원 할인',
    code: 'AMOUNT5000',
    discountType: 'amount',
    discountValue: 5000,
  },
  {
    name: '10% 할인',
    code: 'PERCENT10',
    discountType: 'percentage',
    discountValue: 10,
  },
];

export const initialCouponForm: Coupon = {
  name: '',
  code: '',
  discountType: 'amount',
  discountValue: 0,
};

export const MINIMUM_ORDER_AMOUNT = 10_000;
