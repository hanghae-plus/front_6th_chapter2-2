import { useAtomValue, useSetAtom } from 'jotai';
import { useCallback, useState } from 'react';

import type { CartItem, Coupon } from '../../types';
import { calculateCartTotal } from '../entities/cart';
import { MINIMUM_ORDER_AMOUNT } from '../entities/coupon';
import { addCouponAtom, couponsAtom, deleteCouponAtom } from '../entities/coupon';
import { addNotificationAtom } from '../entities/notification';

export function useCouponService() {
  const coupons = useAtomValue(couponsAtom);
  const addCoupon = useSetAtom(addCouponAtom);
  const deleteCoupon = useSetAtom(deleteCouponAtom);
  const addNotification = useSetAtom(addNotificationAtom);

  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const onResetSelectedCoupon = useCallback(() => {
    setSelectedCoupon(null);
  }, []);

  const onAddCoupon = useCallback(
    (newCoupon: Coupon) => {
      const existingCoupon = coupons.find((c) => c.code === newCoupon.code);
      if (existingCoupon) {
        addNotification('이미 존재하는 쿠폰 코드입니다.', 'error');
        return;
      }
      addCoupon(newCoupon);
      addNotification('쿠폰이 추가되었습니다.', 'success');
    },
    [coupons, addNotification, addCoupon]
  );

  const onDeleteCoupon = useCallback(
    (couponCode: string) => {
      deleteCoupon(couponCode);
      if (selectedCoupon?.code === couponCode) {
        onResetSelectedCoupon();
      }
      addNotification('쿠폰이 삭제되었습니다.', 'success');
    },
    [selectedCoupon, addNotification, deleteCoupon, onResetSelectedCoupon]
  );

  const onApplyCoupon = useCallback(
    (cart: CartItem[], coupon: Coupon) => {
      const currentTotal = calculateCartTotal(cart, selectedCoupon).totalAfterDiscount;

      if (currentTotal < MINIMUM_ORDER_AMOUNT && coupon.discountType === 'percentage') {
        addNotification(
          `percentage 쿠폰은 ${MINIMUM_ORDER_AMOUNT.toLocaleString()}원 이상 구매 시 사용 가능합니다.`,
          'error'
        );
        return;
      }

      setSelectedCoupon(coupon);
      addNotification('쿠폰이 적용되었습니다.', 'success');
    },
    [selectedCoupon, addNotification]
  );

  return {
    coupons,
    selectedCoupon,
    onAddCoupon,
    onDeleteCoupon,
    onApplyCoupon,
    onResetSelectedCoupon,
  };
}
