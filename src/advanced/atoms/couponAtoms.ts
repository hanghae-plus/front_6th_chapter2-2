import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

// 초기 쿠폰 데이터
const initialCoupons = [
  {
    id: '1',
    name: '5000원 할인',
    code: 'AMOUNT5000',
    discountType: 'amount' as 'amount' | 'percentage',
    discountValue: 5000,
  },
  {
    id: '2',
    name: '10% 할인',
    code: 'PERCENT10',
    discountType: 'percentage' as 'amount' | 'percentage',
    discountValue: 10,
  },
];

export interface Coupon {
  id: string;
  name: string;
  code: string;
  discountType: 'amount' | 'percentage';
  discountValue: number;
}

export const couponsAtom = atomWithStorage<Coupon[]>('coupons', initialCoupons);
export const selectedCouponAtom = atom<Coupon | null>(null);
export const couponFormAtom = atom({
  id: '',
  name: '',
  code: '',
  discountType: 'amount' as 'amount' | 'percentage',
  discountValue: 0,
});
