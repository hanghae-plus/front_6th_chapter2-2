import { Dispatch, useCallback, useState } from 'react';
import { CouponType } from '@/types';

interface UseCouponPropsType {
  setCoupons: Dispatch<React.SetStateAction<CouponType[]>>;
  addNotification: (message: string, type: 'success' | 'error') => void;
  coupons: CouponType[];
}

export const useCoupon = ({ coupons, setCoupons, addNotification }: UseCouponPropsType) => {
  // 선택된 쿠폰
  const [selectedCoupon, setSelectedCoupon] = useState<CouponType | null>(null);

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
    [coupons, addNotification]
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
    [selectedCoupon, addNotification]
  );

  return { coupons, setCoupons, addCoupon, deleteCoupon, selectedCoupon, setSelectedCoupon };
};
