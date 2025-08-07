import CartItem from "@/basic/features/cart/components/CartItem";
import { useCart } from "@/basic/features/cart/hooks/useCart";
import { Coupon } from "@/basic/features/coupon/types/coupon.type";
import { AddNotification } from "@/basic/features/notification/types/notification";
import Icon from "@/basic/shared/components/icons/Icon";

interface CartDetailProps {
  addNotification: AddNotification;
  selectedCoupon: Coupon | null;
  setSelectedCoupon: (coupon: Coupon | null) => void;
}

export default function CartDetail({
  addNotification,
  selectedCoupon,
  setSelectedCoupon,
}: CartDetailProps) {
  const { cart } = useCart({
    addNotification,
    selectedCoupon,
    setSelectedCoupon,
  });

  const isEmptyCart = cart.length === 0;

  return (
    <section className="bg-white rounded-lg border border-gray-200 p-4">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Icon type="shop" size={5} color="text-gray-900" />
        장바구니
      </h2>

      {isEmptyCart ? (
        <div className="flex flex-col items-center justify-center py-8 gap-4">
          <Icon type="shopThin" size={16} color="text-gray-300" />

          <p className="text-gray-500 text-sm">장바구니가 비어있습니다</p>
        </div>
      ) : (
        <div className="space-y-3">
          {cart.map((item) => (
            <CartItem
              key={item.product.id}
              item={item}
              addNotification={addNotification}
              selectedCoupon={selectedCoupon}
              setSelectedCoupon={setSelectedCoupon}
            />
          ))}
        </div>
      )}
    </section>
  );
}
