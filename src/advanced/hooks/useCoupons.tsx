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
import type { Coupon } from '../../types';
import {
  addCouponAtom,
  applyCouponAtom,
  clearSelectedCouponAtom,
  couponsAtom,
  deleteCouponAtom,
  selectedCouponAtom,
} from '../atoms/coupon';
import { initialCoupons } from '../constants';
import { useAtomWithLocalStorage } from '../utils/hooks/useLocalStorage';
import { useNotify } from './useNotification';

interface UseCouponsReturn {
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  clearSelectedCoupon: () => void;
}

export function useCoupons(): UseCouponsReturn {
  const notify = useNotify();
  const [coupons, setCoupons] = useAtomWithLocalStorage({
    key: 'coupons',
    initialValue: initialCoupons,
    atom: couponsAtom,
  });

  return {
    coupons,
  };
}

export function useAddCoupon() {
  const notify = useNotify();
  const _addCoupon = useSetAtom(addCouponAtom);

  const addCoupon = ({ newCoupon }: { newCoupon: Coupon }) => {
    const { message, success } = _addCoupon({ newCoupon });

    notify({ message, type: success ? 'success' : 'error' });
  };

  return addCoupon;
}

export function useDeleteCoupon() {
  const notify = useNotify();
  const _deleteCoupon = useSetAtom(deleteCouponAtom);

  const deleteCoupon = ({ couponCode }: { couponCode: string }) => {
    const { message, success } = _deleteCoupon({ couponCode });

    notify({ message, type: success ? 'success' : 'error' });
  };

  return deleteCoupon;
}

export function useApplyCoupon() {
  const notify = useNotify();
  const _applyCoupon = useSetAtom(applyCouponAtom);

  const applyCoupon = ({ coupon }: { coupon: Coupon }) => {
    const { message, success } = _applyCoupon({ coupon });

    notify({ message, type: success ? 'success' : 'error' });
  };

  return applyCoupon;
}

export function useSelectedCoupon() {
  return useAtom(selectedCouponAtom);
}

export function useClearSelectedCoupon() {
  return useSetAtom(clearSelectedCouponAtom);
}
