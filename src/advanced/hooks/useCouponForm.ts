import { useAtom } from 'jotai';
import { useCallback } from 'react';
import { couponFormAtom } from '../atoms/couponAtoms';

/**
 * 쿠폰 폼 상태를 관리하는 커스텀 Hook (Jotai 버전)
 *
 * 관리하는 상태:
 * - couponForm: 쿠폰 폼 데이터
 * - resetCouponForm: 폼 초기화 함수
 *
 * @returns { couponForm, setCouponForm, resetCouponForm }
 */
export const useCouponForm = () => {
  const [couponForm, setCouponForm] = useAtom(couponFormAtom);

  const resetCouponForm = useCallback(() => {
    setCouponForm({
      id: '',
      name: '',
      code: '',
      discountType: 'amount',
      discountValue: 0,
    });
  }, [setCouponForm]);

  return {
    couponForm,
    setCouponForm,
    resetCouponForm,
  };
};
