import { useCouponAtom } from "../../coupon";
import { useCartAtom } from "../hooks";
import { calculateCartTotal } from "../utils";
import { CartItemList } from "./CartItemList";
import { CouponSelector } from "./CouponSelector";
import { PaymentSummary } from "./PaymentSummary";

export function CartSidebar() {
  const { cart, updateQuantity, removeFromCart, completeOrder, calculateItemTotal } = useCartAtom();
  const { coupons, selectedCoupon, applyCoupon, setSelectedCoupon } = useCouponAtom();

  const totals = calculateCartTotal(cart, selectedCoupon);

  return (
    <div className="sticky top-24 space-y-4">
      <CartItemList
        cart={cart}
        calculateItemTotal={calculateItemTotal}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
      />
      {cart.length > 0 && (
        <>
          <CouponSelector
            coupons={coupons}
            selectedCoupon={selectedCoupon}
            applyCoupon={applyCoupon}
            setSelectedCoupon={setSelectedCoupon}
          />
          <PaymentSummary totals={totals} completeOrder={completeOrder} />
        </>
      )}
    </div>
  );
}
