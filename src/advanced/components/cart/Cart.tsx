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
  totals,
}: {
  cart: CartItemType[];
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  setSelectedCoupon: (coupon: Coupon | null) => void;
  handleApplyCoupon: (coupon: Coupon) => void;
  handleCompleteOrder: () => void;
  totals: CartTotal;
}) => {
  return (
    <div className='sticky top-24 space-y-4'>
      <CartItems cart={cart} />

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
