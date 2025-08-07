import { useCallback, useState } from 'react';
import { Coupon } from '../../../types';

export const useCouponsForm = (
  coupons: Coupon[],
  setCoupons: React.Dispatch<React.SetStateAction<Coupon[]>>,
  selectedCoupon: Coupon | null = null,
  setSelectedCoupon: React.Dispatch<React.SetStateAction<Coupon | null>>,
  onAddSuccess: (message: string) => void,
  onAddError: (message: string) => void,
  onDeleteSuccess: (message: string) => void,
) => {
  const [couponForm, setCouponForm] = useState({
    name: '',
    code: '',
    discountType: 'amount' as 'amount' | 'percentage',
    discountValue: 0,
  });

  const addCoupon = useCallback(
    (newCoupon: Coupon, coupons: Coupon[]) => {
      const existingCoupon = coupons.find((c) => c.code === newCoupon.code);
      if (existingCoupon) {
        // addNotification('이미 존재하는 쿠폰 코드입니다.', 'error');
        onAddError?.('이미 존재하는 쿠폰 코드입니다.');
        return;
      }
      setCoupons((prev) => [...prev, newCoupon]);
      // addNotification('쿠폰이 추가되었습니다.', 'success');
      onAddSuccess?.('쿠폰이 추가되었습니다.');
    },
    [coupons, onAddSuccess, onAddError],
  );

  const deleteCoupon = useCallback(
    (couponCode: string) => {
      setCoupons((prev) => prev.filter((c) => c.code !== couponCode));
      if (selectedCoupon?.code === couponCode) {
        setSelectedCoupon(null);
      }
      // addNotification('쿠폰이 삭제되었습니다.', 'success');
      onDeleteSuccess?.('쿠폰이 삭제되었습니다.');
    },
    [selectedCoupon, onDeleteSuccess],
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
    // setShowCouponForm(false);
    onSuccess?.();
  };

  return {
    couponForm,
    setCouponForm,
    deleteCoupon,
    handleCouponSubmit,
  };
};
