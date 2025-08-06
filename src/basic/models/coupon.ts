import { Coupon } from '../../types'
import { MAX_DISCOUNT_RATE } from '../constants'

export const calculateDiscountedTotal = (total: number, coupon: Coupon) => {
  let totalAfterDiscount = total
  if (coupon.discountType === 'amount') {
    totalAfterDiscount = Math.max(0, totalAfterDiscount - coupon.discountValue)
  } else {
    totalAfterDiscount = Math.round(
      totalAfterDiscount * (1 - coupon.discountValue / MAX_DISCOUNT_RATE),
    )
  }

  return totalAfterDiscount
}
