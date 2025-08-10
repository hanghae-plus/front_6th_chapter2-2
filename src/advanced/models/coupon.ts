import { Coupon } from "../../types";
import { stringUtils } from "../utils/stringUtils";

const couponModel = {
  create({ coupon, coupons }: { coupon: Coupon; coupons: Coupon[] }): Coupon[] {
    return [...coupons, coupon];
  },

  update({
    coupon,
    field,
    value,
  }: {
    coupon: Coupon;
    field: keyof Coupon;
    value: string;
  }): Coupon {
    return {
      ...coupon,
      [field]: value,
    };
  },

  initialize(): Coupon {
    return {
      name: "",
      code: "",
      discountType: "amount",
      discountValue: 0,
    };
  },

  isDuplicateCode({
    code,
    coupons,
  }: {
    code: string;
    coupons: Coupon[];
  }): Boolean {
    return coupons.some((coupon) => coupon.code === code);
  },

  formatCouponCode(counCode: string): string {
    return stringUtils.normalizeCouponCode(counCode);
  },

  findByCode(coupons: Coupon[], code: string): Coupon | undefined {
    return coupons.find((coupon) => coupon.code === code);
  },
};

export default couponModel;
