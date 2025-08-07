// TODO: 쿠폰 관리 Hook
// 힌트:
// 1. 쿠폰 목록 상태 관리 (localStorage 연동 고려)
// 2. 쿠폰 추가/삭제
//
// 반환할 값:
// - coupons: 쿠폰 배열
// - addCoupon: 새 쿠폰 추가
// - removeCoupon: 쿠폰 삭제

import { useLocalStorage } from '../utils/hooks/useLocalStorage.ts';
import { initialCoupons } from '../constants';
import { useCallback } from 'react';
import { Coupon, CouponOperationResult, OperationSuccess } from '../../types.ts';

interface useCouponsProps {
  onCouponDeleted: (couponCode: string) => void;
}

export function useCoupons({ onCouponDeleted }: useCouponsProps): {
  coupons: Coupon[];
  addCoupon: (newCoupon: Coupon) => CouponOperationResult;
  deleteCoupon: (couponCode: string) => { success: OperationSuccess };
} {
  const [coupons, setCoupons] = useLocalStorage<Coupon[]>('coupons', initialCoupons);

  const addCoupon = useCallback(
    (newCoupon: Coupon): CouponOperationResult => {
      const exists = coupons.find((c) => c.code === newCoupon.code);

      if (exists) {
        return {
          error: {
            type: 'COUPON_EXISTS',
            message: '이미 존재하는 쿠폰 코드입니다.',
          },
        };
      }

      setCoupons((prevCoupons) => [...prevCoupons, newCoupon]);
      return {
        success: {
          type: 'COUPON_ADDED',
          message: '쿠폰이 추가되었습니다.',
        },
      };
    },
    [coupons, setCoupons],
  );

  const deleteCoupon = useCallback(
    (couponCode: string): { success: OperationSuccess } => {
      setCoupons((prevCoupons) => prevCoupons.filter((c) => c.code !== couponCode));
      onCouponDeleted(couponCode);
      return {
        success: {
          type: 'COUPON_DELETED',
          message: '쿠폰이 삭제되었습니다.',
        },
      };
    },
    [onCouponDeleted, setCoupons],
  );

  return {
    coupons,
    addCoupon,
    deleteCoupon,
  };
}
