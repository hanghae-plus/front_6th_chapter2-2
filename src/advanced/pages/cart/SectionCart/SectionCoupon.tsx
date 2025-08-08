import type { CartItem, Coupon } from "../../../../types.ts"
import { CouponOptionView } from "./CouponOptionView.tsx"
import { calculateCartTotal } from "../../../entities/CartItem.ts"
import { getCouponApplicationError } from "../../../entities/Coupon.ts"
import type { HandleNotificationAdd } from "../../../entities/Notification.ts"

export function SectionCoupon({
  coupons,
  selectedCoupon,
  cart,
  setSelectedCoupon,
  handleNotificationAdd,
}: {
  coupons: Coupon[]
  selectedCoupon: Coupon | null
  cart: CartItem[]
  setSelectedCoupon: React.Dispatch<React.SetStateAction<Coupon | null>>
  handleNotificationAdd: HandleNotificationAdd
}) {
  function handleCouponApply(coupon: Coupon) {
    const currentTotal = calculateCartTotal(cart, selectedCoupon).totalAfterDiscount

    const error = getCouponApplicationError(coupon, currentTotal)
    if (error) {
      handleNotificationAdd(error, "error")
      return
    }

    setSelectedCoupon(coupon)
    handleNotificationAdd("쿠폰이 적용되었습니다.", "success")
  }

  function handleChangeCouponSelect(e: React.ChangeEvent<HTMLSelectElement>) {
    const coupon = coupons.find((c) => c.code === e.target.value)
    if (coupon) handleCouponApply(coupon)
    else setSelectedCoupon(null)
  }

  return (
    <section className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">쿠폰 할인</h3>

        <button className="text-xs text-blue-600 hover:underline">쿠폰 등록</button>
      </div>

      {coupons.length > 0 && (
        <select
          className="w-full text-sm border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
          value={selectedCoupon?.code || ""}
          onChange={handleChangeCouponSelect}
        >
          <option value="">쿠폰 선택</option>
          {coupons.map((coupon) => (
            <CouponOptionView key={coupon.code} coupon={coupon} />
          ))}
        </select>
      )}
    </section>
  )
}
