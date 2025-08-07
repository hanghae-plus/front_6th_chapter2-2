import { useCallback } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { Coupon } from '../../../../types';
import {
  couponsAtom,
  selectedCouponAtom,
} from '../../../shared/store/couponsAtom';
import { cartTotalsAtom } from '../../../shared/store/cartTotalsAtom';
import { useNotification } from '../../../shared/utils';

export function useCoupons() {
  const { addNotification } = useNotification();
  const [coupons, setCoupons] = useAtom(couponsAtom);
  const [selectedCoupon, setSelectedCoupon] = useAtom(selectedCouponAtom);
  const cartTotals = useAtomValue(cartTotalsAtom);

  // 쿠폰 추가
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
    [coupons, addNotification, setCoupons]
  );

  // 쿠폰 삭제
  const deleteCoupon = useCallback(
    (couponCode: string) => {
      setCoupons((prev) => prev.filter((c) => c.code !== couponCode));
      if (selectedCoupon?.code === couponCode) {
        setSelectedCoupon(null);
      }
      addNotification('쿠폰이 삭제되었습니다.', 'success');
    },
    [selectedCoupon, addNotification, setCoupons, setSelectedCoupon]
  );

  // 쿠폰 적용
  const applyCoupon = useCallback(
    (coupon: Coupon) => {
      const currentTotal = cartTotals.totalAfterDiscount;

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
    [addNotification, cartTotals.totalAfterDiscount, setSelectedCoupon]
  );

  return {
    coupons,
    selectedCoupon,
    addCoupon,
    deleteCoupon,
    applyCoupon,
    setSelectedCoupon,
  };
}
