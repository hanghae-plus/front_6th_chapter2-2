import type { CartItem, Coupon } from "../../../../types";
import { CartItemList } from "./CartItemList";
import { CouponSelector } from "./CouponSelector";
import { PaymentSummary } from "./PaymentSummary";

type CartSidebarProps = {
  cart: CartItem[];
  calculateItemTotal: (item: CartItem) => number;
  updateQuantity: (productId: string, newQuantity: number) => void;
  removeFromCart: (productId: string) => void;
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  applyCoupon: (coupon: Coupon) => void;
  setSelectedCoupon: (coupon: Coupon | null) => void;
  totals: {
    totalBeforeDiscount: number;
    totalAfterDiscount: number;
  };
  completeOrder: () => void;
};

export function CartSidebar({
  cart,
  calculateItemTotal,
  updateQuantity,
  removeFromCart,
  coupons,
  selectedCoupon,
  applyCoupon,
  setSelectedCoupon,
  totals,
  completeOrder
}: CartSidebarProps) {
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
