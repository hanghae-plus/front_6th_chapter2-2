import { Coupon } from "../../types";
import { priceUtils } from "./priceUtils";

export const couponUtils = {
  /**
   * 쿠폰 표시 텍스트 생성 (UI 표시용)
   */
  getDisplayText(coupon: Coupon): string {
    const discountText =
      coupon.discountType === "amount"
        ? `${priceUtils.formatCurrency(coupon.discountValue, false)}`
        : `${coupon.discountValue}%`;

    return `${coupon.name} (${discountText})`;
  },

  /**
   * 할인 금액 계산 (UI 표시용)
   */
  getDiscountAmount(
    totalBeforeDiscount: number,
    totalAfterDiscount: number
  ): number {
    return Math.max(0, totalBeforeDiscount - totalAfterDiscount);
  },

  /**
   * 할인 적용 여부 확인 (UI 표시용)
   */
  hasDiscount(
    totalBeforeDiscount: number,
    totalAfterDiscount: number
  ): boolean {
    return totalBeforeDiscount > totalAfterDiscount;
  },
};
