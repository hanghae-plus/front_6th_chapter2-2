import { calculateCartTotal } from "../../../entities/CartItem.ts"
import { useCart } from "../../../hooks/useCart.ts"
import { useCoupons } from "../../../hooks/useCoupons.ts"
import { useNotification } from "../../../hooks/useNotification.ts"

export function SectionPaymentInfo() {
  const { cart, setCart } = useCart()
  const { selectedCoupon, setSelectedCoupon } = useCoupons()

  const { handleNotificationAdd } = useNotification()

  const totals = calculateCartTotal(cart, selectedCoupon)
  const discountAmount = totals.totalBeforeDiscount - totals.totalAfterDiscount

  function handleOrderComplete() {
    const orderNumber = `ORD-${Date.now()}`

    handleNotificationAdd(`주문이 완료되었습니다. 주문번호: ${orderNumber}`, "success")

    setCart([])
    setSelectedCoupon(null)
  }

  return (
    <section className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-lg font-semibold mb-4">결제 정보</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">상품 금액</span>
          <span className="font-medium">{totals.totalBeforeDiscount.toLocaleString()}원</span>
        </div>
        {discountAmount > 0 && (
          <div className="flex justify-between text-red-500">
            <span>할인 금액</span>
            <span>-{discountAmount.toLocaleString()}원</span>
          </div>
        )}
        <div className="flex justify-between py-2 border-t border-gray-200">
          <span className="font-semibold">결제 예정 금액</span>
          <span className="font-bold text-lg text-gray-900">{totals.totalAfterDiscount.toLocaleString()}원</span>
        </div>
      </div>

      <button
        className="w-full mt-4 py-3 bg-yellow-400 text-gray-900 rounded-md font-medium hover:bg-yellow-500 transition-colors"
        onClick={handleOrderComplete}
      >
        {totals.totalAfterDiscount.toLocaleString()}원 결제하기
      </button>

      <div className="mt-3 text-xs text-gray-500 text-center">
        <p>* 실제 결제는 이루어지지 않습니다</p>
      </div>
    </section>
  )
}
