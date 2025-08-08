import { useAtom } from 'jotai';

import Cart from './Cart';
import CouponSection from '../components/payment/CouponSection';
import PaymentSummary from '../components/payment/PaymentSummary';
import { cartAtom } from '../store/atoms';

export default function PaymentSection() {
  const [cart] = useAtom(cartAtom);

  return (
    <div className='sticky top-24 space-y-4'>
      <Cart />

      {cart.length > 0 && (
        <>
          <CouponSection />
          <PaymentSummary />
        </>
      )}
    </div>
  );
}
