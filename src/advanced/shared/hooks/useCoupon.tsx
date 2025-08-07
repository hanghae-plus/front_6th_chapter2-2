import { useNotification } from './useNotification';
import { Coupon } from '../types';
import { useAtom } from 'jotai';
import { couponsAtom } from '../../store/atoms/couponAtom';
import { ADD_COUPON, DELETE_COUPON } from '../constants';

export const useCoupon = () => {
  const [coupons, dispatch] = useAtom(couponsAtom);
  const { addNotification } = useNotification();

  const addCoupon = (newCoupon: Coupon) => {
    const existingCoupon = coupons.find(c => c.code === newCoupon.code);
    if (existingCoupon) {
      addNotification('이미 존재하는 쿠폰 코드입니다.', 'error');
      return;
    }
    dispatch({ type: ADD_COUPON, payload: { coupon: newCoupon } });
    addNotification('쿠폰이 추가되었습니다.', 'success');
  };

  const deleteCoupon = (couponCode: string) => {
    dispatch({ type: DELETE_COUPON, payload: { couponCode } });
    addNotification('쿠폰이 삭제되었습니다.', 'success');
  };

  return {
    coupons,
    addCoupon,
    deleteCoupon,
  };
};
