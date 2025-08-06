import { CouponWithUI } from "./coupon.types";

export const initialCoupons: CouponWithUI[] = [
  {
    id: "c1",
    name: "5000원 할인",
    code: "AMOUNT5000",
    discountType: "amount",
    discountValue: 5000,
  },
  {
    id: "c2",
    name: "10% 할인",
    code: "PERCENT10",
    discountType: "percentage",
    discountValue: 10,
  },
];
