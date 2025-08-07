import { CartItem, Coupon } from "../../../../types";
import CartItemBox from "./CartItemBox";
import { CouponSection } from "../CouponSection";
import { PaymentSection } from "../PaymentSection";
import { BagIcon, EmptyCartIcon } from "../../elements/Icons";

interface CartSidebarProps {
  cart: CartItem[];
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  totals: { totalBeforeDiscount: number; totalAfterDiscount: number };
  calculateItemTotal: (item: CartItem) => number;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  applyCoupon: (coupon: Coupon) => void;
  setSelectedCoupon: (coupon: Coupon | null) => void;
  completeOrder: () => void;
}

export const CartSidebar = ({ cart, coupons, selectedCoupon, totals, calculateItemTotal, removeFromCart, updateCartQuantity, applyCoupon, setSelectedCoupon, completeOrder }: CartSidebarProps) => {
  return (
    <div className="sticky top-24 space-y-4">
      <section className="bg-white rounded-lg border border-gray-200 p-4">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <BagIcon />
          장바구니
        </h2>

        {cart.length === 0 ? (
          <div className="text-center py-8">
            <EmptyCartIcon />
            <p className="text-gray-500 text-sm">장바구니가 비어있습니다</p>
          </div>
        ) : (
          <div className="space-y-3">
            {cart.map((item) => (
              <CartItemBox key={item.product.id} item={item} calculateItemTotal={calculateItemTotal} onRemove={removeFromCart} onUpdateQuantity={updateCartQuantity} />
            ))}
          </div>
        )}
      </section>

      {cart.length > 0 && (
        <>
          <CouponSection coupons={coupons} selectedCoupon={selectedCoupon} onApplyCoupon={applyCoupon} onSetSelectedCoupon={setSelectedCoupon} />
          <PaymentSection totals={totals} onCompleteOrder={completeOrder} />
        </>
      )}
    </div>
  );
};
