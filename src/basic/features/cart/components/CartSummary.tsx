import CartDetail from "@/basic/features/cart/components/CartDetail";
import OrderDetail from "@/basic/features/cart/components/OrderDetail";
import { useCart } from "@/basic/features/cart/hooks/useCart";
import CouponDetail from "@/basic/features/coupon/components/CouponDetail";
import { Coupon } from "@/basic/features/coupon/types/coupon.type";
import { AddNotification } from "@/basic/features/notification/types/notification";

interface CartSummaryProps {
  addNotification: AddNotification;
  selectedCoupon: Coupon | null;
  setSelectedCoupon: (coupon: Coupon | null) => void;
}

export default function CartSummary({
  addNotification,
  selectedCoupon,
  setSelectedCoupon,
}: CartSummaryProps) {
  const { cart } = useCart({
    addNotification,
    selectedCoupon,
    setSelectedCoupon,
  });

  const hasCart = cart.length > 0;

  return (
    <div className="sticky top-24 space-y-4">
      <CartDetail
        addNotification={addNotification}
        selectedCoupon={selectedCoupon}
        setSelectedCoupon={setSelectedCoupon}
      />

      {hasCart && (
        <>
          <CouponDetail
            addNotification={addNotification}
            selectedCoupon={selectedCoupon}
            setSelectedCoupon={setSelectedCoupon}
          />

          <OrderDetail
            addNotification={addNotification}
            selectedCoupon={selectedCoupon}
            setSelectedCoupon={setSelectedCoupon}
          />
        </>
      )}
    </div>
  );
}
