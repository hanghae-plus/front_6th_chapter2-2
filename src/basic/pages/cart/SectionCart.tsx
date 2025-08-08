import type { CartItem, Coupon } from "../../../types";
import type { HandleNotificationAdd } from "../../entities/Notification";
// import removed: totals and coupon logic moved to child components
import type { ProductWithUI } from "../../entities/ProductWithUI";
import { CartItemView } from "./CartItemView";
import { SectionPaymentInfo } from "./SectionPaymentInfo";
import { IconEmptyCart } from "./IconEmptyCart";
import { IconCart } from "./IconCart";
import { SectionCoupon } from "./SectionCoupon";

export function SectionCart({
  cart,
  products,
  setCart,
  handleNotificationAdd,
  coupons,
  selectedCoupon,
  setSelectedCoupon,
}: {
  cart: CartItem[];
  products: ProductWithUI[];
  setCart: (cart: CartItem[]) => void;
  handleNotificationAdd: HandleNotificationAdd;
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  setSelectedCoupon: (coupon: Coupon | null) => void;
}) {
  // 쿠폰 로직은 SectionCoupon으로 이동

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
                <CartItemView
                  key={cartItem.product.id}
                  item={cartItem}
                  cart={cart}
                  products={products}
                  setCart={setCart}
                  handleNotificationAdd={handleNotificationAdd}
                />
              ))}
            </div>
          )}
        </section>

        {cart.length > 0 && (
          <>
            <SectionCoupon
              coupons={coupons}
              selectedCoupon={selectedCoupon}
              cart={cart}
              setSelectedCoupon={setSelectedCoupon}
              handleNotificationAdd={handleNotificationAdd}
            />

            <SectionPaymentInfo
              cart={cart}
              selectedCoupon={selectedCoupon}
              setCart={setCart}
              setSelectedCoupon={setSelectedCoupon}
              handleNotificationAdd={handleNotificationAdd}
            />
          </>
        )}
      </div>
    </div>
  );
}
