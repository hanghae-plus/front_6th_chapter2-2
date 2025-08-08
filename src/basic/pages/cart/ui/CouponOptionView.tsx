import { Coupon } from "../../../../types.ts";

export function CouponOptionView({ coupon }: { coupon: Coupon }) {
  return (
    <option value={coupon.code}>
      {coupon.name} ({coupon.discountType === "amount" ? `${coupon.discountValue.toLocaleString()}원` : `${coupon.discountValue}%`})
    </option>
  );
}
