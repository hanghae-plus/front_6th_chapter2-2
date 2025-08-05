import { Coupon } from '@/models/coupon';
import { useLocalStorageObject } from '@/shared/hooks';
import { ensureArray } from '@/utils/store-utils';

const initialCoupons: Coupon[] = [
  {
    name: '5000원 할인',
    code: 'AMOUNT5000',
    discountType: 'amount',
    discountValue: 5000
  },
  {
    name: '10% 할인',
    code: 'PERCENT10',
    discountType: 'percentage',
    discountValue: 10
  }
];

export const useCouponStore = () => {
  const [coupons, setCoupons] = useLocalStorageObject<Coupon[]>(
    'coupons',
    initialCoupons
  );

  const addCoupon = (coupon: Coupon) => {
    setCoupons(prev => [...ensureArray(prev), coupon]);
  };

  const removeCouponByCode = (code: string) => {
    setCoupons(prev => ensureArray(prev).filter(c => c.code !== code));
  };

  const hasCouponWithCode = (code: string) => {
    return coupons.some(coupon => coupon.code === code);
  };

  return {
    coupons,
    addCoupon,
    removeCouponByCode,
    hasCouponWithCode
  };
};
