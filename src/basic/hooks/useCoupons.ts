import { Coupon } from '../../types';
import { initialCoupons } from '../constants/initialData';
import { useLocalStorage } from '../shared/hooks';
import { couponModel } from '../models/coupon';

export const useCoupons = () => {
  const [coupons, setCoupons] = useLocalStorage<Coupon[]>('coupons', initialCoupons);

  /**
   * 쿠폰 추가
   * @param newCoupon - 추가할 쿠폰
   */
  const addCoupon = (newCoupon: Coupon) => {
    setCoupons((prev) => couponModel.addCoupon(prev, newCoupon));
  };

  /**
   * 쿠폰 삭제
   * @param couponCode - 삭제할 쿠폰 코드
   */
  const deleteCoupon = (couponCode: string) => {
    setCoupons((prev) => couponModel.deleteCoupon(prev, couponCode));
  };

  return {
    coupons,
    addCoupon,
    deleteCoupon,
  };
};
