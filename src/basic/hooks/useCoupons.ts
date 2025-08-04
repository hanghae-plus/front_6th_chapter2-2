import { ICoupon } from "../type";
import { initialCoupons } from "../constants/initialStates";
import { couponModel } from "../models/coupon";
import { useLocalStorage } from "../utils/hooks/useLocalStorage";

export const useCoupons = () => {
  // 로컬스토리지 연동된 coupons
  const [coupons, setCoupons] = useLocalStorage<ICoupon[]>(
    "coupons",
    initialCoupons
  );

  /**
   * 쿠폰 추가
   */
  const addCoupon = (newCoupon: ICoupon) => {
    setCoupons((prev) => couponModel.addCoupon(prev, newCoupon));
  };

  /**
   * 쿠폰 삭제
   */
  const removeCoupon = (couponCode: string) => {
    setCoupons((prev) => couponModel.deleteCoupon(prev, couponCode));
  };

  return {
    coupons,
    addCoupon,
    removeCoupon,
  };
};
