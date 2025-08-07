import { useAtomValue, useSetAtom } from 'jotai';
import { useCallback, useEffect } from 'react';

import type { CartItem, Coupon } from '../../../../types';
import { calculateCartTotal } from '../../../entities/cart';
import { couponsAtom, MINIMUM_ORDER_AMOUNT } from '../../../entities/coupon';
import { addNotificationAtom } from '../../../entities/notification';
import { useSelectedCoupon } from '../ui/useSelectedCoupon';

export function useCouponApplyService() {
  const coupons = useAtomValue(couponsAtom);
  const { selectedCoupon, selectCoupon, resetSelectedCoupon, isValidCoupon } = useSelectedCoupon();
  const addNotification = useSetAtom(addNotificationAtom);

  useEffect(() => {
    if (!isValidCoupon(selectedCoupon, coupons)) {
      resetSelectedCoupon();
    }
  }, [coupons, selectedCoupon, resetSelectedCoupon, isValidCoupon]);

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

      selectCoupon(coupon);
      addNotification('쿠폰이 적용되었습니다.', 'success');
    },
    [selectedCoupon, addNotification, selectCoupon]
  );

  return { selectedCoupon, onApplyCoupon };
}
