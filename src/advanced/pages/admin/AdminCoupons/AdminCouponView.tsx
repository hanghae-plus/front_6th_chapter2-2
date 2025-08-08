import type { Coupon } from "../../../../types"
import { IconTrash } from "../../../components/icons/IconTrash"
import { useNotification } from "../../../hooks/useNotification"
import { useCoupons } from "../../../hooks/useCoupons"

export function AdminCouponView({ coupon }: { coupon: Coupon }) {
  const { handleNotificationAdd } = useNotification()
  const { setCoupons, selectedCoupon, setSelectedCoupon } = useCoupons()

  function handleCouponDelete(couponCode: string) {
    setCoupons((prev) => prev.filter((c) => c.code !== couponCode))
    if (selectedCoupon?.code === couponCode) {
      setSelectedCoupon(null)
    }
    handleNotificationAdd("쿠폰이 삭제되었습니다.", "success")
  }

  return (
    <div key={coupon.code} className="relative bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-200">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{coupon.name}</h3>
          <p className="text-sm text-gray-600 mt-1 font-mono">{coupon.code}</p>
          <div className="mt-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white text-indigo-700">
              {coupon.discountType === "amount" ? `${coupon.discountValue.toLocaleString()}원 할인` : `${coupon.discountValue}% 할인`}
            </span>
          </div>
        </div>

        <button className="text-gray-400 hover:text-red-600 transition-colors" onClick={() => handleCouponDelete(coupon.code)}>
          <IconTrash />
        </button>
      </div>
    </div>
  )
}
