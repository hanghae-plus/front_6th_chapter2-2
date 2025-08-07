import {
  calculateCartTotal,
  calculateItemTotal,
} from '../../../../utils/calulator.ts';
import { BagIcon } from '../../../icons';

import CartListItem from '../cart/CartItem.tsx';
import EmptyCart from '../cart/EmptyCart.tsx';
import CartSection from '../cart/CartSection.tsx';
import { cartAtom } from '../../../../store/entities/cart.store.ts';
import { useAtomValue } from 'jotai';
import { selectedCouponAtom } from '../../../../store/entities/coupon.store.ts';
import CouponDiscountContent from '../coupon/CouponDiscountContent.tsx';
import CheckoutContent from './CheckoutContent.tsx';

const CheckArea = () => {
  const cart = useAtomValue(cartAtom);
  const selectedCoupon = useAtomValue(selectedCouponAtom);
  const totals = calculateCartTotal(cart, selectedCoupon);
  return (
    <div className="lg:col-span-1">
      <div className="sticky top-24 space-y-4">
        <CartSection>
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <BagIcon />
            장바구니
          </h2>
          {cart.length === 0 ? (
            <EmptyCart />
          ) : (
            <ul className="space-y-3">
              {cart.map(item => {
                const itemTotal = calculateItemTotal(item, cart);
                return (
                  <CartListItem
                    key={`cart-item-${item.product.name}`}
                    item={item}
                    itemTotal={itemTotal}
                  />
                );
              })}
            </ul>
          )}
        </CartSection>

        {cart.length > 0 && (
          <>
            <CartSection>
              <CouponDiscountContent />
            </CartSection>

            <CartSection>
              <CheckoutContent totals={totals} />
            </CartSection>
          </>
        )}
      </div>
    </div>
  );
};

export default CheckArea;
