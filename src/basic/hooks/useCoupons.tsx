// TODO: 쿠폰 관리 Hook
// 힌트:
// 1. 쿠폰 목록 상태 관리 (localStorage 연동 고려)
// 2. 쿠폰 추가/삭제
//
// 반환할 값:
// - coupons: 쿠폰 배열
// - addCoupon: 새 쿠폰 추가
// - removeCoupon: 쿠폰 삭제

import { useCallback, useState } from 'react';
import type { Coupon } from '../../types';
import { initialCoupons } from '../constants';
import * as couponModel from '../models/coupon';
import { useLocalStorage } from '../utils/hooks/useLocalStorage';

interface UseCouponsParams {
  addNotification: (params: {
    message: string;
    type: 'error' | 'success';
  }) => void;
  calculateCartTotal: ({ coupon }: { coupon: Coupon }) => {
    totalAfterDiscount: number;
    totalBeforeDiscount: number;
  };
}

interface UseCouponsReturn {
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  addCoupon: (params: { newCoupon: Coupon }) => void;
  deleteCoupon: (params: { couponCode: string }) => void;
  applyCoupon: (params: { coupon: Coupon }) => void;
  clearSelectedCoupon: () => void;
}

export function useCoupons({
  addNotification,
  calculateCartTotal,
}: UseCouponsParams): UseCouponsReturn {
  const [coupons, setCoupons] = useLocalStorage({
    key: 'coupons',
    initialValue: initialCoupons,
  });
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  return {
    coupons,
    selectedCoupon,

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

    applyCoupon: useCallback(
      ({ coupon }) => {
        setSelectedCoupon((prevCoupon) => {
          const { totalAfterDiscount } = calculateCartTotal({
            coupon,
          });
          return couponModel.applyCoupon({
            coupon,
            prevCoupon,
            cartTotal: totalAfterDiscount,
            onFailure: ({ message }) => {
              addNotification({ message, type: 'error' });
            },
          });
        });
      },
      [calculateCartTotal, addNotification]
    ),

    clearSelectedCoupon: useCallback(() => {
      setSelectedCoupon(null);
    }, []),
  };
}
