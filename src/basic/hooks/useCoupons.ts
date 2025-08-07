import { useCallback } from 'react';
import { Coupon } from '../../types';
import { initialCoupons } from '../constants/initialData';
import { couponsAtom } from '../atoms';
import { useAtom } from 'jotai';

interface UseCouponsOptions {
  storageKey?: string;
  defaultCoupons?: Coupon[];
}

export interface UseCouponsReturn {
  coupons: Coupon[];
  addCoupon: (coupon: Coupon) => { success: boolean; message?: string };
  deleteCoupon: (code: string) => void;
}

export const useCoupons = (
  options?: UseCouponsOptions
): UseCouponsReturn => {
  const storageKey = options?.storageKey ?? 'coupons';
  const defaultCoupons = options?.defaultCoupons ?? initialCoupons;

  const [coupons, setCoupons] = useAtom(couponsAtom);

  const persist = (next: Coupon[]) => {
    setCoupons(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
  };

  const addCoupon = useCallback(
    (coupon: Coupon) => {
      if (coupons.some((c) => c.code === coupon.code)) {
        return { success: false, message: '이미 존재하는 쿠폰 코드입니다.' } as const;
      }
      persist([...coupons, coupon]);
      return { success: true } as const;
    },
    [coupons]
  );

  const deleteCoupon = useCallback(
    (code: string) => {
      const next = coupons.filter((c) => c.code !== code);
      persist(next);
    },
    [coupons]
  );

  /* ----------------------------- storage sync ----------------------------- */
  const onStorage = useCallback(
    (e: StorageEvent) => {
      if (e.key === storageKey && e.newValue) {
        try {
          const next = JSON.parse(e.newValue) as Coupon[];
          setCoupons(next);
        } catch {/* ignore */}
      }
    },
    [storageKey]
  );

  return {
    coupons,
    addCoupon,
    deleteCoupon,
  };
};

