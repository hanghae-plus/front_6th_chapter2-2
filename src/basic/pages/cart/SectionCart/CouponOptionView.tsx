import type { Coupon } from "../../../../types.ts"

export function CouponOptionView({ coupon }: { coupon: Coupon }) {
  const countDiscountString = coupon.discountType === "amount" ? `${coupon.discountValue.toLocaleString()}원` : `${coupon.discountValue}%`

  return (
    <option value={coupon.code}>
      {coupon.name} ({countDiscountString})
    </option>
  )
}
