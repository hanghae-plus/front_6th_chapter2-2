import { useAppState } from './useAppState';
import { useNotification } from './useNotification';
import { Coupon } from '../types';

export const useCoupon = (
  appState: ReturnType<typeof useAppState>,
  notificationActions: ReturnType<typeof useNotification>
) => {
  const { coupons, setCoupons, selectedCoupon, setSelectedCoupon } = appState;
  const { addNotification } = notificationActions;

  const addCoupon = (newCoupon: Coupon) => {
    const existingCoupon = coupons.find(c => c.code === newCoupon.code);
    if (existingCoupon) {
      addNotification('이미 존재하는 쿠폰 코드입니다.', 'error');
      return;
    }
    setCoupons(prev => [...prev, newCoupon]);
    addNotification('쿠폰이 추가되었습니다.', 'success');
  };

  const deleteCoupon = (couponCode: string) => {
    setCoupons(prev => prev.filter(c => c.code !== couponCode));
    if (selectedCoupon?.code === couponCode) {
      setSelectedCoupon(null);
    }
    addNotification('쿠폰이 삭제되었습니다.', 'success');
  };

  return {
    coupons,
    selectedCoupon,
    setSelectedCoupon,
    addCoupon,
    deleteCoupon,
  };
};
