import { CartItem } from "../../../types";
import { Coupon } from "../../../types";
import CartList from "./CartList";
import CartHeader from "./CartHeader";
import CouponSection from "./CouponSection";
import PaymentSection from "./PaymentSection";
import cartService from "../../services/cart";

interface CartProps {
  cart: CartItem[];
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, newQuantity: number) => void;
  calculateItemTotal: (item: CartItem, cart: CartItem[]) => number;
  applyCoupon: (coupon: Coupon) => void;
  clearSelectedCoupon: () => void;
  completeOrder: () => void;
}

export default function Cart({
  cart,
  coupons,
  selectedCoupon,
  removeFromCart,
  updateQuantity,
  calculateItemTotal,
  applyCoupon,
  clearSelectedCoupon,
  completeOrder,
}: CartProps) {
  // 장바구니 총액 계산
  const totals = cartService.calculateCartTotal({
    cart,
    selectedCoupon,
  });

  return (
    <div className="sticky top-24 space-y-4">
      <CartHeader>
        <CartList
          cart={cart}
          removeFromCart={removeFromCart}
          updateQuantity={updateQuantity}
          calculateItemTotal={calculateItemTotal}
        />
      </CartHeader>

      {cart.length > 0 && (
        <>
          <CouponSection
            coupons={coupons}
            selectedCoupon={selectedCoupon}
            applyCoupon={applyCoupon}
            clearSelectedCoupon={clearSelectedCoupon}
          />
          <PaymentSection
            totalBeforeDiscount={totals.totalBeforeDiscount}
            totalAfterDiscount={totals.totalAfterDiscount}
            completeOrder={completeOrder}
          />
        </>
      )}
    </div>
  );
}
