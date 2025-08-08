import { useState, useCallback } from 'react';
import { Coupon, initialCoupons, CartItem } from '../../types';
import { useLocalStorage } from './useLocalStorage';
import { calculateCartTotal } from '../utils/calculators';

export const useCoupons = (
  cart: CartItem[],
  addNotification: (
    message: string,
    type: 'error' | 'success' | 'warning'
  ) => void
) => {
  const [coupons, setCoupons] = useLocalStorage<Coupon[]>(
    'coupons',
    initialCoupons
  );
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const applyCoupon = useCallback(
    (coupon: Coupon) => {
      const currentTotal = calculateCartTotal(
        cart,
        selectedCoupon
      ).totalAfterDiscount;

      if (currentTotal < 10000 && coupon.discountType === 'percentage') {
        addNotification(
          'percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.',
          'error'
        );
        return;
      }

      setSelectedCoupon(coupon);
      addNotification('쿠폰이 적용되었습니다.', 'success');
    },
    [addNotification, calculateCartTotal, cart, selectedCoupon]
  );

  const addCoupon = useCallback(
    (newCoupon: Coupon) => {
      const existingCoupon = coupons.find((c) => c.code === newCoupon.code);
      if (existingCoupon) {
        addNotification('이미 존재하는 쿠폰 코드입니다.', 'error');
        return;
      }
      setCoupons((prev) => [...prev, newCoupon]);
      addNotification('쿠폰이 추가되었습니다.', 'success');
    },
    [coupons, addNotification]
  );

  const deleteCoupon = useCallback(
    (couponCode: string) => {
      setCoupons((prev) => prev.filter((c) => c.code !== couponCode));
      if (selectedCoupon?.code === couponCode) {
        setSelectedCoupon(null);
      }
      addNotification('쿠폰이 삭제되었습니다.', 'success');
    },
    [selectedCoupon, addNotification]
  );

  return {
    coupons,
    selectedCoupon,
    setSelectedCoupon,
    addCoupon,
    deleteCoupon,
    applyCoupon,
  };
};
