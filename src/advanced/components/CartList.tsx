import { useAtomValue, useSetAtom } from 'jotai';

import { cartAtom, removeFromCartAtom, updateCartItemQuantityAtom } from '../atoms/cartAtoms';
import { calculateItemTotal } from '../models/cart';
import { CartCouponList } from './cart/CartCouponList';
import { PaymentInfo } from './cart/PaymentInfo';

export const CartPage = () => {
  // atoms 직접 사용
  const cart = useAtomValue(cartAtom);

  // action atoms
  const removeFromCartAction = useSetAtom(removeFromCartAtom);
  const updateQuantityAction = useSetAtom(updateCartItemQuantityAtom);

  const removeFromCart = (productId: string) => {
    removeFromCartAction(productId);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    updateQuantityAction({ productId, quantity });
  };

  return (
    <div className='lg:col-span-1'>
      <div className='sticky top-24 space-y-4'>
        <section className='bg-white rounded-lg border border-gray-200 p-4'>
          <h2 className='text-lg font-semibold mb-4 flex items-center'>
            <svg className='w-5 h-5 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z'
              />
            </svg>
            장바구니
          </h2>
          {cart.length === 0 ? (
            <div className='text-center py-8'>
              <svg
                className='w-16 h-16 text-gray-300 mx-auto mb-4'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={1}
                  d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z'
                />
              </svg>
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
                  <div key={item.product.id} className='border-b pb-3 last:border-b-0'>
                    <div className='flex justify-between items-start mb-2'>
                      <h4 className='text-sm font-medium text-gray-900 flex-1'>
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className='text-gray-400 hover:text-red-500 ml-2'
                      >
                        <svg
                          className='w-4 h-4'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M6 18L18 6M6 6l12 12'
                          />
                        </svg>
                      </button>
                    </div>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center'>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className='w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100'
                        >
                          <span className='text-xs'>−</span>
                        </button>
                        <span className='mx-3 text-sm font-medium w-8 text-center'>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className='w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100'
                        >
                          <span className='text-xs'>+</span>
                        </button>
                      </div>
                      <div className='text-right'>
                        {hasDiscount && (
                          <span className='text-xs text-red-500 font-medium block'>
                            -{discountRate}%
                          </span>
                        )}
                        <p className='text-sm font-medium text-gray-900'>
                          {Math.round(itemTotal).toLocaleString()}원
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {cart.length > 0 && (
          <>
            <CartCouponList />
            <PaymentInfo />
          </>
        )}
      </div>
    </div>
  );
};
