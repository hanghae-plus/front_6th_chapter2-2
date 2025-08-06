import { Coupon } from '../../types'

export const calculateDiscountedTotal = (total: number, coupon: Coupon) => {
  let totalAfterDiscount = total
  if (coupon.discountType === 'amount') {
    totalAfterDiscount = Math.max(0, totalAfterDiscount - coupon.discountValue)
  } else {
    totalAfterDiscount = Math.round(
      totalAfterDiscount * (1 - coupon.discountValue / 100),
    )
  }

  return totalAfterDiscount
}
