import { useAtomValue, useSetAtom } from 'jotai';
import { useCallback } from 'react';

import type { Coupon } from '../../../../types';
import { addCouponAtom, couponsAtom, deleteCouponAtom } from '../../../entities/coupon';
import { addNotificationAtom } from '../../../entities/notification';

export function useAdminCouponService() {
  const coupons = useAtomValue(couponsAtom);
  const addCoupon = useSetAtom(addCouponAtom);
  const deleteCoupon = useSetAtom(deleteCouponAtom);

  const addNotification = useSetAtom(addNotificationAtom);

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
      addNotification('쿠폰이 삭제되었습니다.', 'success');
    },
    [addNotification, deleteCoupon]
  );

  const isValidCoupon = (couponCode: Coupon) => {
    return coupons.some((coupon) => coupon.code === couponCode?.code);
  };

  return { onAddCoupon, onDeleteCoupon, isValidCoupon };
}
