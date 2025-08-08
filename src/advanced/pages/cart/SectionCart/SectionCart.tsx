import { IconCart } from "../../../components/icons/IconCart.tsx"
import { IconEmptyCart } from "../../../components/icons/IconEmptyCart.tsx"
import { useCart } from "../../../hooks/useCart.ts"
import { CartItemView } from "./CartItemView.tsx"
import { SectionCoupon } from "./SectionCoupon.tsx"
import { SectionPaymentInfo } from "./SectionPaymentInfo.tsx"

export function SectionCart() {
  const { cart } = useCart()

  return (
    <div className="lg:col-span-1">
      <div className="sticky top-24 space-y-4">
        <section className="bg-white rounded-lg border border-gray-200 p-4">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <IconCart />
            장바구니
          </h2>

          {cart.length === 0 ? (
            <div className="text-center py-8">
              <IconEmptyCart />
              <p className="text-gray-500 text-sm">장바구니가 비어있습니다</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((cartItem) => (
                <CartItemView key={cartItem.product.id} item={cartItem} />
              ))}
            </div>
          )}
        </section>

        {cart.length > 0 && (
          <>
            <SectionCoupon />

            <SectionPaymentInfo />
          </>
        )}
      </div>
    </div>
  )
}
