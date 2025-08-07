import CartDetail from "@/advanced/features/cart/components/CartDetail";
import OrderDetail from "@/advanced/features/cart/components/OrderDetail";
import { useCart } from "@/advanced/features/cart/hooks/useCart";
import CouponDetail from "@/advanced/features/coupon/components/CouponDetail";
import { Coupon } from "@/advanced/features/coupon/types/coupon.type";

interface CartSummaryProps {
  selectedCoupon: Coupon | null;
  setSelectedCoupon: (coupon: Coupon | null) => void;
}

export default function CartSummary({
  selectedCoupon,
  setSelectedCoupon,
}: CartSummaryProps) {
  const { cart } = useCart({
    selectedCoupon,
    setSelectedCoupon,
  });

  const hasCart = cart.length > 0;

  return (
    <div className="sticky top-24 space-y-4">
      <CartDetail
        selectedCoupon={selectedCoupon}
        setSelectedCoupon={setSelectedCoupon}
      />

      {hasCart && (
        <>
          <CouponDetail
            selectedCoupon={selectedCoupon}
            setSelectedCoupon={setSelectedCoupon}
          />

          <OrderDetail
            selectedCoupon={selectedCoupon}
            setSelectedCoupon={setSelectedCoupon}
          />
        </>
      )}
    </div>
  );
}
