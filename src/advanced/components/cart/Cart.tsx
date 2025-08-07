import { useAtom } from 'jotai';

import CartItems from './CartItems';
import CouponSelector from './CouponSelector';
import PaymentSummary from './PaymentSummary';
import { applyCouponAtom, completeOrderAtom } from '../../store/actions';
import { cartAtom, cartTotalAtom, couponsAtom, selectedCouponAtom } from '../../store/atoms';

const Cart = () => {
  const [cart] = useAtom(cartAtom);
  const [totals] = useAtom(cartTotalAtom);
  const [coupons] = useAtom(couponsAtom);
  const [selectedCoupon, setSelectedCoupon] = useAtom(selectedCouponAtom);
  const [, applyCoupon] = useAtom(applyCouponAtom);
  const [, completeOrder] = useAtom(completeOrderAtom);

  const handleApplyCoupon = (coupon: any) => {
    applyCoupon({
      coupon,
      onNotification: () => {
        // 알림은 이미 applyCouponAtom 내부에서 처리됨
      },
    });
  };

  const handleCompleteOrder = () => {
    completeOrder();
  };

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
