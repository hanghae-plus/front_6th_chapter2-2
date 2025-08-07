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
import type { CartItem, Coupon } from '../../types';
import { initialCoupons } from '../constants';
import * as cartModel from '../models/cart';
import * as couponModel from '../models/coupon';
import { useLocalStorage } from '../utils/hooks/useLocalStorage';
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
          const result = couponModel.addCoupon({
            newCoupon,
            coupons: prevCoupons,
          });

          if (!result.success) {
            notify({ message: result.message, type: 'error' });
            return prevCoupons;
          }

          notify({ message: result.message, type: 'success' });
          return result.newCoupons;
        });
      },
      [setCoupons, notify]
    ),

    deleteCoupon: useCallback(
      ({ couponCode }) => {
        setCoupons((prevCoupons) => {
          const result = couponModel.deleteCoupon({
            coupons: prevCoupons,
            couponCode,
          });

          notify({ message: result.message, type: 'success' });
          return result.newCoupons;
        });
      },
      [setCoupons, notify]
    ),

    applyCoupon: useCallback(
      ({ cart, coupon }) => {
        setSelectedCoupon((prevCoupon) => {
          const { totalAfterDiscount } = cartModel.calculateCartTotal({
            cart,
            applyCoupon: couponModel.getCouponApplier({ coupon }),
          });

          const result = couponModel.applyCoupon({
            coupon,
            prevCoupon,
            cartTotal: totalAfterDiscount,
          });

          if (!result.success) {
            notify({ message: result.message, type: 'error' });
            return prevCoupon;
          }

          notify({ message: result.message, type: 'success' });
          return result.selectedCoupon;
        });
      },
      [notify]
    ),

    clearSelectedCoupon: useCallback(() => {
      setSelectedCoupon(null);
    }, []),
  };
}
