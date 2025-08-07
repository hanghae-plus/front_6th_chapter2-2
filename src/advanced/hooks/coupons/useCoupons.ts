import { useCallback } from 'react';
import { useAtom, useSetAtom } from 'jotai';
import { CartItem, Coupon } from '../../../types';
import { calculateCartTotal } from '../../utils/calculations/cartCalculations';
import { couponsAtom, selectedCouponAtom } from '../../atoms/couponsAtom';
import { addNotificationAtom } from '../../atoms/notificationsAtom';

export const useCoupons = () => {
  const [coupons, setCoupons] = useAtom(couponsAtom);
  const [selectedCoupon, setSelectedCoupon] = useAtom(selectedCouponAtom);
  const addNotification = useSetAtom(addNotificationAtom);

  // 쿠폰 사용하기
  const applyCoupon = useCallback(
    (coupon: Coupon, cart: CartItem[]) => {
      const currentTotal = calculateCartTotal(cart, selectedCoupon).totalAfterDiscount;

      if (currentTotal < 10000 && coupon.discountType === 'percentage') {
        addNotification({
          message: 'percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.',
          type: 'error',
        });
        return;
      }

      setSelectedCoupon(coupon);
      addNotification({
        message: '쿠폰이 적용되었습니다.',
        type: 'success',
      });
    },
    [selectedCoupon, setSelectedCoupon, addNotification],
  );

  return {
    coupons,
    setCoupons,
    selectedCoupon,
    setSelectedCoupon,
    applyCoupon,
  };
};
