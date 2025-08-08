import type { CartItem, Coupon } from "../../../../types.ts"
import { IconCart } from "../../../components/icons/IconCart.tsx"
import { IconEmptyCart } from "../../../components/icons/IconEmptyCart.tsx"
import { useProducts } from "../../../hooks/useProducts.ts"
import { CartItemView } from "./CartItemView.tsx"
import { SectionCoupon } from "./SectionCoupon.tsx"
import { SectionPaymentInfo } from "./SectionPaymentInfo.tsx"

export function SectionCart({
  cart,
  setCart,
  coupons,
  selectedCoupon,
  setSelectedCoupon,
}: {
  cart: CartItem[]
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>
  coupons: Coupon[]
  selectedCoupon: Coupon | null
  setSelectedCoupon: React.Dispatch<React.SetStateAction<Coupon | null>>
}) {
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
                <CartItemView key={cartItem.product.id} item={cartItem} cart={cart} setCart={setCart} />
              ))}
            </div>
          )}
        </section>

        {cart.length > 0 && (
          <>
            <SectionCoupon coupons={coupons} selectedCoupon={selectedCoupon} cart={cart} setSelectedCoupon={setSelectedCoupon} />

            <SectionPaymentInfo cart={cart} selectedCoupon={selectedCoupon} setCart={setCart} setSelectedCoupon={setSelectedCoupon} />
          </>
        )}
      </div>
    </div>
  )
}
