// TODO: 쿠폰 관리 Hook
// 힌트:
// 1. 쿠폰 목록 상태 관리 (localStorage 연동 고려)
// 2. 쿠폰 추가/삭제
//
// 반환할 값:
// - coupons: 쿠폰 배열
// - addCoupon: 새 쿠폰 추가
// - removeCoupon: 쿠폰 삭제

import { useCallback } from 'react';
import type { Coupon } from '../../types';
import { initialCoupons } from '../constants';
import * as couponModel from '../models/coupon';
import { useLocalStorage } from '../utils/hooks/useLocalStorage';

interface UseCouponsParams {
  addNotification: (params: {
    message: string;
    type: 'error' | 'success';
  }) => void;
}

interface UseCouponsReturn {
  coupons: Coupon[];
  addCoupon: (params: { newCoupon: Coupon }) => void;
  deleteCoupon: (params: { couponCode: string }) => void;
}

export function useCoupons({
  addNotification,
}: UseCouponsParams): UseCouponsReturn {
  const [coupons, setCoupons] = useLocalStorage({
    key: 'coupons',
    initialValue: initialCoupons,
  });

  return {
    coupons,

    addCoupon: useCallback(
      ({ newCoupon }) => {
        setCoupons((prevCoupons) => {
          return couponModel.addCoupon({
            newCoupon,
            coupons: prevCoupons,
            onFailure: ({ message }) => {
              addNotification({ message, type: 'error' });
            },
            onSuccess: () => {
              addNotification({
                message: '쿠폰이 추가되었습니다.',
                type: 'success',
              });
            },
          });
        });
      },
      [setCoupons, addNotification]
    ),

    deleteCoupon: useCallback(
      ({ couponCode }) => {
        setCoupons((prevCoupons) => {
          return couponModel.deleteCoupon({
            coupons: prevCoupons,
            couponCode,
            onSuccess: () => {
              addNotification({
                message: '쿠폰이 삭제되었습니다.',
                type: 'success',
              });
            },
          });
        });
      },
      [setCoupons, addNotification]
    ),
  };
}
