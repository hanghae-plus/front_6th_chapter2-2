import { useCallback, useState } from 'react';
import { Coupon } from '../../../types';
import { useAtom, useSetAtom } from 'jotai';
import { couponsAtom, selectedCouponAtom } from '../../atoms/couponsAtom';
import { addNotificationAtom } from '../../atoms/notificationsAtom';

export const useCouponsForm = () => {
  const [coupons, setCoupons] = useAtom(couponsAtom);
  const [couponForm, setCouponForm] = useState({
    name: '',
    code: '',
    discountType: 'amount' as 'amount' | 'percentage',
    discountValue: 0,
  });
  const [selectedCoupon, setSelectedCoupon] = useAtom(selectedCouponAtom);

  const addNotification = useSetAtom(addNotificationAtom);

  const addCoupon = useCallback(
    (newCoupon: Coupon, coupons: Coupon[]) => {
      const existingCoupon = coupons.find((c) => c.code === newCoupon.code);
      if (existingCoupon) {
        addNotification({ message: '이미 존재하는 쿠폰 코드입니다.', type: 'error' });
        return;
      }
      setCoupons((prev) => [...prev, newCoupon]);
      addNotification({ message: '쿠폰이 추가되었습니다.', type: 'success' });
    },
    [coupons],
  );

  const deleteCoupon = useCallback(
    (couponCode: string) => {
      setCoupons((prev) => prev.filter((c) => c.code !== couponCode));
      if (selectedCoupon?.code === couponCode) {
        setSelectedCoupon(null);
      }
      addNotification({ message: '쿠폰이 삭제되었습니다.', type: 'success' });
    },
    [selectedCoupon],
  );

  const handleCouponSubmit = (e: React.FormEvent, onSuccess?: () => void) => {
    e.preventDefault();
    addCoupon(couponForm, coupons);
    setCouponForm({
      name: '',
      code: '',
      discountType: 'amount',
      discountValue: 0,
    });
    onSuccess?.();
  };

  return {
    couponForm,
    setCouponForm,
    deleteCoupon,
    handleCouponSubmit,
  };
};
