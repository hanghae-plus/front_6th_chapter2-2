// TODO: 쿠폰 관리 Hook
// 힌트:
// 1. 쿠폰 목록 상태 관리 (localStorage 연동 고려)
// 2. 쿠폰 추가/삭제
//
// 반환할 값:
// - coupons: 쿠폰 배열
// - addCoupon: 새 쿠폰 추가
// - removeCoupon: 쿠폰 삭제

import { useAtom } from 'jotai';
import { useCallback } from 'react';
import type { CartItem, Coupon } from '../../types';
import { couponsAtom, selectedCouponAtom } from '../atoms/coupon';
import { initialCoupons } from '../constants';
import * as cartModel from '../models/cart';
import * as couponModel from '../models/coupon';
import { useAtomWithLocalStorage } from '../utils/hooks/useLocalStorage';
import { useNotify } from './useNotification';

interface UseCouponsReturn {
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  addCoupon: (params: { newCoupon: Coupon }) => void;
  deleteCoupon: (params: { couponCode: string }) => void;
  applyCoupon: (params: { cart: CartItem[]; coupon: Coupon }) => void;
  clearSelectedCoupon: () => void;
}

export function useCoupons(): UseCouponsReturn {
  const notify = useNotify();
  const [coupons, setCoupons] = useAtomWithLocalStorage({
    key: 'coupons',
    initialValue: initialCoupons,
    atom: couponsAtom,
  });
  const [selectedCoupon, setSelectedCoupon] = useAtom(selectedCouponAtom);

  return {
    coupons,
    selectedCoupon,

    addCoupon: useCallback(
      ({ newCoupon }) => {
        const result = couponModel.addCoupon({
          newCoupon,
          coupons,
        });

        if (!result.success) {
          notify({ message: result.message, type: 'error' });
          return;
        }

        setCoupons(result.newCoupons);
        notify({ message: result.message, type: 'success' });
      },
      [setCoupons, notify, coupons]
    ),

    deleteCoupon: useCallback(
      ({ couponCode }) => {
        const result = couponModel.deleteCoupon({
          coupons,
          couponCode,
        });

        setCoupons(result.newCoupons);
        notify({ message: result.message, type: 'success' });
      },
      [setCoupons, notify, coupons]
    ),

    applyCoupon: useCallback(
      ({ cart, coupon }) => {
        const { totalAfterDiscount } = cartModel.calculateCartTotal({
          cart,
          applyCoupon: couponModel.getCouponApplier({ coupon }),
        });

        const result = couponModel.applyCoupon({
          coupon,
          prevCoupon: selectedCoupon,
          cartTotal: totalAfterDiscount,
        });

        if (!result.success) {
          notify({ message: result.message, type: 'error' });
          return;
        }

        setSelectedCoupon(result.selectedCoupon);
        notify({ message: result.message, type: 'success' });
      },
      [notify, selectedCoupon]
    ),

    clearSelectedCoupon: useCallback(() => {
      setSelectedCoupon(null);
    }, []),
  };
}
