import { Coupon } from "../../types";

const addCoupon = ({
  newCoupon,
  coupons,
}: {
  newCoupon: Coupon;
  coupons: Coupon[];
}) => {
  const existingCoupon = coupons.find((c) => c.code === newCoupon.code);
  if (existingCoupon) {
    return {
      success: false,
      message: "이미 존재하는 쿠폰 코드입니다.",
      coupons: coupons,
    };
  }

  return {
    success: true,
    message: "쿠폰이 추가되었습니다.",
    coupons: [...coupons, newCoupon],
  };
};

const deleteCoupon = ({
  couponCode,
  coupons,
  selectedCoupon,
}: {
  couponCode: string;
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
}) => {
  const newCoupons = coupons.filter((c) => c.code !== couponCode);
  if (selectedCoupon?.code === couponCode) {
    return {
      success: true,
      message: "쿠폰이 삭제되었습니다.",
      coupons: newCoupons,
      resetSelectedCoupon: true,
    };
  }
  return {
    success: true,
    message: "쿠폰이 삭제되었습니다.",
    coupons: newCoupons,
    resetSelectedCoupon: false,
  };
};

export { addCoupon, deleteCoupon };
