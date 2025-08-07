import { useCallback } from 'react';
import { useAtom } from 'jotai';
import { couponsAtom, selectedCouponAtom } from '../../../atoms';
import { CouponType } from '@/types';
import { useNotification } from '../../../hooks/useNotification';

export const useCoupon = () => {
  const [coupons, setCoupons] = useAtom(couponsAtom);
  const [selectedCoupon, setSelectedCoupon] = useAtom(selectedCouponAtom);
  const { addNotification } = useNotification();

  // 쿠폰 추가 (관리자 기능)
  const addCoupon = useCallback(
    (newCoupon: CouponType) => {
      const existingCoupon = coupons.find((c) => c.code === newCoupon.code);
      if (existingCoupon) {
        addNotification('이미 존재하는 쿠폰 코드입니다.', 'error');
        return;
      }
      setCoupons((prev) => [...prev, newCoupon]);
      addNotification('쿠폰이 추가되었습니다.', 'success');
    },
    [coupons, addNotification, setCoupons]
  );

  // 쿠폰 삭제 (관리자 기능)
  const deleteCoupon = useCallback(
    (couponCode: string) => {
      setCoupons((prev) => prev.filter((c) => c.code !== couponCode));
      if (selectedCoupon?.code === couponCode) {
        setSelectedCoupon(null); // 삭제된 쿠폰이 선택되어 있으면 선택 해제
      }
      addNotification('쿠폰이 삭제되었습니다.', 'success');
    },
    [selectedCoupon, addNotification, setCoupons, setSelectedCoupon]
  );

  return {
    coupons,
    setCoupons,
    addCoupon,
    deleteCoupon,
    selectedCoupon,
    setSelectedCoupon,
  };
};
