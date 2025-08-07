import { Coupon } from "@/advanced/features/coupon/types/coupon.type";
import { DiscountType } from "@/advanced/features/discount/types/discount.type";

const initialCoupons: Coupon[] = [
  {
    name: "5000원 할인",
    code: "AMOUNT5000",
    discountType: DiscountType.AMOUNT,
    discountValue: 5000,
  },
  {
    name: "10% 할인",
    code: "PERCENT10",
    discountType: DiscountType.PERCENTAGE,
    discountValue: 10,
  },
];

export const couponData = {
  initialCoupons,
};
