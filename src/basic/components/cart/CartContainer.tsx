import { CartItem } from "./CartItem";
import { CartSummary } from "./CartSummary";
import { CartCoupon } from "./CartCoupon";
import CartEmpty from "./CartEmpty";
import { CartItem as CartItemType, Coupon } from "../../../types";
import { calculateItemDiscount } from "../../utils/calculations";

// 장바구니 아이콘 컴포넌트
const CartIcon = () => (
  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
);

interface CartContainerProps {
  cart: CartItemType[];
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  totalBeforeDiscount: number;
  totalAfterDiscount: number;
  calculateItemTotal: (item: CartItemType) => number;
  onRemoveFromCart: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onApplyCoupon: (coupon: Coupon) => void;
  onRemoveCoupon: () => void;
  onCompleteOrder: () => void;
}

export const CartContainer = ({
  cart,
  coupons,
  selectedCoupon,
  totalBeforeDiscount,
  totalAfterDiscount,
  calculateItemTotal,
  onRemoveFromCart,
  onUpdateQuantity,
  onApplyCoupon,
  onRemoveCoupon,
  onCompleteOrder,
}: CartContainerProps) => {
  const cartItemsWithDiscount = cart.map((item) => {
    const itemTotal = calculateItemTotal(item);
    const { hasDiscount, discountRate } = calculateItemDiscount(item, itemTotal);

    return {
      item,
      itemTotal,
      hasDiscount,
      discountRate,
    };
  });

  if (cartItemsWithDiscount.length === 0) {
    return <CartEmpty />;
  }

  return (
    <div className="space-y-4">
      <section className="bg-white rounded-lg border border-gray-200 p-4">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <CartIcon />
          장바구니
        </h2>
        <div className="space-y-3">
          {cartItemsWithDiscount.map(({ item, itemTotal, hasDiscount, discountRate }) => (
            <CartItem
              key={item.product.id}
              item={item}
              itemTotal={itemTotal}
              hasDiscount={hasDiscount}
              discountRate={discountRate}
              onRemove={onRemoveFromCart}
              onUpdateQuantity={onUpdateQuantity}
            />
          ))}
        </div>
      </section>

      <CartCoupon
        coupons={coupons}
        selectedCoupon={selectedCoupon}
        onApplyCoupon={onApplyCoupon}
        onRemoveCoupon={onRemoveCoupon}
      />

      <CartSummary
        totalBeforeDiscount={totalBeforeDiscount}
        totalAfterDiscount={totalAfterDiscount}
        onCompleteOrder={onCompleteOrder}
      />
    </div>
  );
};
