import { useAtom } from 'jotai';

import CartItems from './CartItems';
import CouponSelector from './CouponSelector';
import PaymentSummary from './PaymentSummary';
import { cartAtom } from '../../store/atoms';

const Cart = () => {
  const [cart] = useAtom(cartAtom);

  return (
    <div className='sticky top-24 space-y-4'>
      <CartItems />

      {cart.length > 0 && (
        <>
          <CouponSelector />

          <PaymentSummary />
        </>
      )}
    </div>
  );
};

export default Cart;
