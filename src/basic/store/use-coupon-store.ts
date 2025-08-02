import { Coupon } from '@/basic/models/coupon';
import { useLocalStorage } from '@/basic/shared/hooks';
import { createStorage } from '@/basic/utils';

const couponStorage = createStorage<Coupon[]>({
  key: 'coupons',
  value: [
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
  ],
});

export const useCouponStore = () => {
  const coupons = useLocalStorage(couponStorage) ?? [];

  const addCoupon = (coupon: Coupon) => {
    couponStorage.set([...(couponStorage.get() ?? []), coupon]);
  };

  const removeCouponByCode = (code: string) => {
    couponStorage.set(couponStorage.get()?.filter(c => c.code !== code) ?? []);
  };

  const hasCouponWithCode = (code: string) => {
    return coupons.some(coupon => coupon.code === code);
  };

  return {
    coupons,
    addCoupon,
    removeCouponByCode,
    hasCouponWithCode,
  };
};
