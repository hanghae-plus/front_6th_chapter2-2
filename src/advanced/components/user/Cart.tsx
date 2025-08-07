import { useAtomValue } from 'jotai';
import { calculateItemTotal } from '../../utils/calculations/cartCalculations';
import { BagIcon } from '../ui/Icons';
import CartItem from './CartItem';
import Checkout from './Checkout';
import CouponSelector from './CouponSelector';
import { cartAtom } from '../../atoms/cartAtom';
import { useCart } from '../../hooks/cart/useCart';

export default function Cart() {
  // atom에서 상태 가져오기
  const cart = useAtomValue(cartAtom);

  // 커스텀 훅에서 함수들 가져오기
  const { removeFromCart, updateQuantity } = useCart();

  return (
    <div className='lg:col-span-1'>
      <div className='sticky top-24 space-y-4'>
        <section className='bg-white rounded-lg border border-gray-200 p-4'>
          <h2 className='text-lg font-semibold mb-4 flex items-center'>
            <BagIcon className='w-5 h-5 mr-2' strokeWidth={2} />
            장바구니
          </h2>
          {cart.length === 0 ? (
            <div className='text-center py-8'>
              <BagIcon className='w-16 h-16 text-gray-300 mx-auto mb-4' strokeWidth={1} />
              <p className='text-gray-500 text-sm'>장바구니가 비어있습니다</p>
            </div>
          ) : (
            <div className='space-y-3'>
              {cart.map((item) => {
                const itemTotal = calculateItemTotal(item, cart);
                const originalPrice = item.product.price * item.quantity;
                const hasDiscount = itemTotal < originalPrice;
                const discountRate = hasDiscount
                  ? Math.round((1 - itemTotal / originalPrice) * 100)
                  : 0;

                return (
                  <CartItem
                    key={item.product.id}
                    item={item}
                    onRemoveFromCart={removeFromCart}
                    onUpdateQuantity={updateQuantity}
                    hasDiscount={hasDiscount}
                    itemTotal={itemTotal}
                    discountRate={discountRate}
                  />
                );
              })}
            </div>
          )}
        </section>

        {cart.length > 0 && (
          <>
            <CouponSelector />
            <Checkout />
          </>
        )}
      </div>
    </div>
  );
}
