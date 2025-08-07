import { initialCoupons } from '@/basic/constants/mocks';
import { useLocalStorage } from '@/basic/hooks';
import { Coupon } from '@/types';
import { useCallback, useState } from 'react';
import { validateCouponCode } from '@/basic/utils';

interface UseCouponsProps {
  addNotification: (message: string, type: 'error' | 'success' | 'warning') => void;
}

export function useCoupons({ addNotification }: UseCouponsProps) {
  const [coupons, setCoupons] = useLocalStorage<Coupon[]>('coupons', initialCoupons);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [couponForm, setCouponForm] = useState({
    name: '',
    code: '',
    discountType: 'amount' as 'amount' | 'percentage',
    discountValue: 0,
  });

  const addCoupon = useCallback(
    (newCoupon: Coupon) => {
      const validation = validateCouponCode(newCoupon.code, coupons);
      if (!validation.isValid) {
        addNotification(validation.errorMessage!, 'error');
        return;
      }
      setCoupons((prev) => [...prev, newCoupon]);
      addNotification('쿠폰이 추가되었습니다.', 'success');
    },
    [coupons, addNotification, setCoupons]
  );

  const deleteCoupon = useCallback(
    (couponCode: string) => {
      setCoupons((prev) => prev.filter((c) => c.code !== couponCode));
      if (selectedCoupon?.code === couponCode) {
        setSelectedCoupon(null);
      }
      addNotification('쿠폰이 삭제되었습니다.', 'success');
    },
    [selectedCoupon, addNotification, setCoupons]
  );

  return {
    coupons,
    selectedCoupon,
    couponForm,
    showCouponForm,

    setCoupons,
    setSelectedCoupon,
    setShowCouponForm,
    setCouponForm,

    addCoupon,
    deleteCoupon,
  };
}
