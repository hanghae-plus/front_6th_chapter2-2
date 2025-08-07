import CartItems from './CartItems';
import CouponSelector from './CouponSelector';
import PaymentSummary from './PaymentSummary';
import { CartItem as CartItemType, Coupon } from '../../../types';

interface CartTotal {
  totalBeforeDiscount: number;
  totalAfterDiscount: number;
}

const Cart = ({
  cart,
  coupons,
  selectedCoupon,
  setSelectedCoupon,
  handleApplyCoupon,
  handleCompleteOrder,
  handleUpdateQuantity,
  removeFromCart,
  totals,
}: {
  cart: CartItemType[];
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  setSelectedCoupon: (coupon: Coupon | null) => void;
  handleApplyCoupon: (coupon: Coupon) => void;
  handleCompleteOrder: () => void;
  handleUpdateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  totals: CartTotal;
}) => {
  return (
    <div className='sticky top-24 space-y-4'>
      <CartItems
        cart={cart}
        handleUpdateQuantity={handleUpdateQuantity}
        removeFromCart={removeFromCart}
      />

      {cart.length > 0 && (
        <>
          <CouponSelector
            coupons={coupons}
            selectedCoupon={selectedCoupon}
            setSelectedCoupon={setSelectedCoupon}
            handleApplyCoupon={handleApplyCoupon}
          />

          <PaymentSummary totals={totals} handleCompleteOrder={handleCompleteOrder} />
        </>
      )}
    </div>
  );
};

export default Cart;
