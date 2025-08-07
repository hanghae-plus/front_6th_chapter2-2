import CartDetail from "@/advanced/features/cart/components/CartDetail";
import OrderDetail from "@/advanced/features/cart/components/OrderDetail";
import { useCart } from "@/advanced/features/cart/hooks/useCart";
import CouponDetail from "@/advanced/features/coupon/components/CouponDetail";

export default function CartSummary() {
  const { cart } = useCart();

  const hasCart = cart.length > 0;

  return (
    <div className="sticky top-24 space-y-4">
      <CartDetail />

      {hasCart && (
        <>
          <CouponDetail />

          <OrderDetail />
        </>
      )}
    </div>
  );
}
