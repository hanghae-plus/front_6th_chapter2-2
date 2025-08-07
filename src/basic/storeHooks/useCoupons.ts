import { useCallback, useState, useEffect } from 'react';
import { Coupon } from '../../types';
import { initialCoupons } from '../datas/coupons';
import { useSyncedLocalStorage } from '../utils/hooks/useSyncedLocalStorage';

export const useCoupons = () => {
  const [coupons, setCoupons] = useSyncedLocalStorage<Coupon[]>('coupons', initialCoupons);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const addCoupon = useCallback(
    (newCoupon: Coupon) => {
      setCoupons(prev => [...prev, newCoupon]);
    },
    [setCoupons]
  );

  const deleteCoupon = useCallback(
    (couponCode: string) => {
      setCoupons(prev => prev.filter(c => c.code !== couponCode));
    },
    [setCoupons]
  );

  // 쿠폰이 삭제되면 선택된 쿠폰도 자동으로 해제
  useEffect(() => {
    if (selectedCoupon && !coupons.find(c => c.code === selectedCoupon.code)) {
      setSelectedCoupon(null);
    }
  }, [coupons, selectedCoupon]);

  return {
    coupons,
    addCoupon,
    deleteCoupon,
    selectedCoupon,
    setSelectedCoupon
  };
};
