// TODO: 쿠폰 관리 Hook
// 힌트:
// 1. 쿠폰 목록 상태 관리 (localStorage 연동 고려)
// 2. 쿠폰 추가/삭제
//
// 반환할 값:
// - coupons: 쿠폰 배열
// - addCoupon: 새 쿠폰 추가
// - removeCoupon: 쿠폰 삭제
import { useAtom, useSetAtom } from 'jotai';
import { useCallback } from 'react';

import { couponsAtom, addCouponAtom, deleteCouponAtom } from '../atoms/couponAtoms';
import { Coupon } from '../types';

const useCoupon = () => {
  // atoms 구독
  const [coupons] = useAtom(couponsAtom);

  // action atoms
  const addCouponAction = useSetAtom(addCouponAtom);
  const deleteCouponAction = useSetAtom(deleteCouponAtom);

  // wrapper 함수들
  const addCoupon = useCallback(
    (newCoupon: Coupon) => {
      addCouponAction(newCoupon);
    },
    [addCouponAction],
  );

  const deleteCoupon = useCallback(
    (couponCode: string) => {
      deleteCouponAction(couponCode);
    },
    [deleteCouponAction],
  );

  return { coupons, addCoupon, deleteCoupon };
};

export { useCoupon };
