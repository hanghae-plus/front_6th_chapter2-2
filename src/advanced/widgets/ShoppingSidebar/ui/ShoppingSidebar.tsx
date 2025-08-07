import { useAtomValue } from 'jotai';
import { useCart } from '../../../features/cart/hooks';
import { CartItemsList } from '../../../features/cart/ui';
import { CouponSelector } from '../../../features/coupon/shop/ui';
import { OrderSummary } from '../../../features/order/ui';
import { cartAtom, cartTotalsAtom } from '../../../shared/store';

export function ShoppingSidebar() {
  const cart = useAtomValue(cartAtom);
  const totals = useAtomValue(cartTotalsAtom);
  const { removeFromCart, updateQuantity } = useCart();

  return (
    <div className='sticky top-24 space-y-4'>
      {/* 장바구니 아이템 섹션 */}
      <CartItemsList
        cart={cart}
        onRemove={removeFromCart}
        onUpdateQuantity={updateQuantity}
      />
      {/* 쿠폰 + 주문 섹션 */}
      {cart.length > 0 && (
        <>
          <CouponSelector />
          <OrderSummary
            totals={totals}
          />
        </>
      )}
    </div>
  );
}
