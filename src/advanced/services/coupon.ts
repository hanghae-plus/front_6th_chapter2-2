import { Coupon, ValidationResult } from "../../types";
import { VALIDATION_LIMITS } from "../utils/constants";
import couponModel from "../models/coupon";

export type CouponOperationResult =
  | {
      success: true;
      value: Coupon[];
      message: string;
      status: "success";
    }
  | {
      success: false;
      message: string;
      status: "error";
    };

const couponService = {
  addCoupon: ({
    coupons,
    newCoupon,
  }: {
    coupons: Coupon[];
    newCoupon: Coupon;
  }): CouponOperationResult => {
    const isDuplicate = couponModel.isDuplicateCode({
      code: newCoupon.code,
      coupons,
    });

    if (isDuplicate) {
      return {
        success: false,
        message: "이미 존재하는 쿠폰 코드입니다.",
        status: "error",
      };
    }

    const updatedCoupons = couponModel.create({ coupon: newCoupon, coupons });
    return {
      success: true,
      value: updatedCoupons,
      message: "쿠폰이 추가되었습니다.",
      status: "success",
    };
  },

  deleteCoupon: ({
    coupons,
    couponCode,
  }: {
    coupons: Coupon[];
    couponCode: string;
  }): CouponOperationResult => {
    const updatedCoupons = coupons.filter((c) => c.code !== couponCode);
    return {
      success: true,
      value: updatedCoupons,
      message: "쿠폰이 삭제되었습니다.",
      status: "success",
    };
  },

  updateCoupon: ({
    coupons,
    couponCode,
    updates,
  }: {
    coupons: Coupon[];
    couponCode: string;
    updates: Partial<Coupon>;
  }): CouponOperationResult => {
    const updatedCoupons = coupons.map((coupon) =>
      coupon.code === couponCode ? { ...coupon, ...updates } : coupon
    );
    return {
      success: true,
      value: updatedCoupons,
      message: "쿠폰이 수정되었습니다.",
      status: "success",
    };
  },

  validateDiscountRange({
    discountType,
    discountValue,
  }: Pick<Coupon, "discountType" | "discountValue">): ValidationResult {
    if (discountType === "percentage") {
      if (discountValue > VALIDATION_LIMITS.DISCOUNT.MAX_PERCENTAGE) {
        return {
          isValid: false,
          message: "할인율은 100%를 초과할 수 없습니다",
          value: VALIDATION_LIMITS.DISCOUNT.MAX_PERCENTAGE,
        };
      }
      if (discountValue < 0) {
        return {
          isValid: false,
          message: "할인율은 0% 미만일 수 없습니다",
          value: VALIDATION_LIMITS.DISCOUNT.MIN_VALUE,
        };
      }
    } else {
      if (discountValue > VALIDATION_LIMITS.DISCOUNT.MAX_AMOUNT) {
        return {
          isValid: false,
          message: "할인 금액은 100,000원을 초과할 수 없습니다",
          value: VALIDATION_LIMITS.DISCOUNT.MAX_AMOUNT,
        };
      }
      if (discountValue < 0) {
        return {
          isValid: false,
          message: "할인 금액은 0원 미만일 수 없습니다",
          value: VALIDATION_LIMITS.DISCOUNT.MIN_VALUE,
        };
      }
    }

    return {
      isValid: true,
      value: discountValue,
      message: "",
    };
  },

  apply({ coupon, cartTotal }: { coupon: Coupon; cartTotal: number }): {
    isValid: boolean;
    message: string;
  } {
    if (
      cartTotal < VALIDATION_LIMITS.CART.MIN_TOTAL_FOR_PERCENTAGE_COUPON &&
      coupon.discountType === "percentage"
    ) {
      return {
        isValid: false,
        message: "percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.",
      };
    }
    return {
      isValid: true,
      message: "",
    };
  },

  handleCouponSelection({
    coupons,
    selectedCode,
    applyCoupon,
    clearSelectedCoupon,
  }: {
    coupons: Coupon[];
    selectedCode: string;
    applyCoupon: (coupon: Coupon) => void;
    clearSelectedCoupon: () => void;
  }): void {
    const coupon = couponModel.findByCode(coupons, selectedCode);
    if (coupon) {
      applyCoupon(coupon);
    } else {
      clearSelectedCoupon();
    }
  },

  // 할인 관련 비즈니스 로직
  applyPercentageDiscount(basePrice: number, discountPercent: number): number {
    return Math.round(basePrice * (1 - discountPercent / 100));
  },

  applyAmountDiscount(basePrice: number, discountAmount: number): number {
    return Math.max(0, basePrice - discountAmount);
  },

  calculateDiscountRate(
    originalPrice: number,
    discountedPrice: number
  ): number {
    if (discountedPrice >= originalPrice) return 0;
    return Math.round((1 - discountedPrice / originalPrice) * 100);
  },

  getDiscountAmount(
    totalBeforeDiscount: number,
    totalAfterDiscount: number
  ): number {
    return Math.max(0, totalBeforeDiscount - totalAfterDiscount);
  },

  hasDiscount(
    totalBeforeDiscount: number,
    totalAfterDiscount: number
  ): boolean {
    return totalBeforeDiscount > totalAfterDiscount;
  },
};

export default couponService;
