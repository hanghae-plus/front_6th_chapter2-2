import { useCallback } from 'react';

import { Coupon } from '../../types';

export function useCoupon(
  coupons: Coupon[],
  setCoupons: (coupons: Coupon[] | ((prev: Coupon[]) => Coupon[])) => void,
  selectedCoupon: Coupon | null,
  setSelectedCoupon: (coupon: Coupon | null) => void,
  addNotification: (message: string, type?: 'error' | 'success' | 'warning') => void,
  getCartTotal: (
    selectedCoupon?: { discountType: 'amount' | 'percentage'; discountValue: number } | null
  ) => { totalBeforeDiscount: number; totalAfterDiscount: number }
) {
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
    [coupons, setCoupons, addNotification]
  );

  const deleteCoupon = useCallback(
    (couponCode: string) => {
      setCoupons((prev) => prev.filter((c) => c.code !== couponCode));
      if (selectedCoupon?.code === couponCode) {
        setSelectedCoupon(null);
      }
      addNotification('쿠폰이 삭제되었습니다.', 'success');
    },
    [selectedCoupon, setCoupons, setSelectedCoupon, addNotification]
  );

  const applyCoupon = useCallback(
    (coupon: Coupon) => {
      const currentTotal = getCartTotal(selectedCoupon).totalAfterDiscount;

      if (currentTotal < 10000 && coupon.discountType === 'percentage') {
        addNotification('percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.', 'error');
        return;
      }

      setSelectedCoupon(coupon);
      addNotification('쿠폰이 적용되었습니다.', 'success');
    },
    [selectedCoupon, getCartTotal, setSelectedCoupon, addNotification]
  );

  const clearSelectedCoupon = useCallback(() => {
    setSelectedCoupon(null);
  }, [setSelectedCoupon]);

  return {
    addCoupon,
    deleteCoupon,
    applyCoupon,
    clearSelectedCoupon,
  };
}
