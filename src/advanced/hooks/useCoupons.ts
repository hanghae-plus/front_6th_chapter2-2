import { useAtom } from "jotai";
import { couponsAtom } from "../store/atom";
import { ICoupon } from "../type";
import { couponModel } from "../models/coupon";

export const useCoupons = () => {
  // 로컬스토리지 연동된 coupons
  const [coupons, setCoupons] = useAtom(couponsAtom);

  /**
   * 쿠폰 추가
   */
  const addCoupon = (newCoupon: ICoupon) => {
    setCoupons((prev) => couponModel.addCoupon(prev, newCoupon));
  };

  /**
   * 쿠폰 삭제
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
