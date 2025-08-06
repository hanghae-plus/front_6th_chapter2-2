import { useCallback, useState } from 'react';

import type { CartItem, Coupon, NotificationVariant } from '../../types';
import type { ProductWithUI } from '../constants';
import { Icon } from './icons';
import { calculateCartTotal } from '../models/entity';
import { CartHeader } from './ui/CartHeader';
import { CartItemList } from './ui/CartItemList';
import { CouponSelector } from './ui/CouponSelector';
import { PaymentSummary } from './ui/PaymentSummary';
import { ProductList } from './ui/ProductList';
import { useCartService } from '../hooks/useCartService';
import { useDebounce } from '../utils/hooks/useDebounce';

interface CartPageProps {
  setIsAdmin: (isAdmin: boolean) => void;

  products: ProductWithUI[];

  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  onResetSelectedCoupon: () => void;
  onApplyCoupon: (cart: CartItem[], coupon: Coupon) => void;

  onAddNotification: (message: string, type: NotificationVariant) => void;
}

export function CartPage({
  setIsAdmin,

  products,

  coupons,
  selectedCoupon,
  onResetSelectedCoupon,
  onApplyCoupon,

  onAddNotification,
}: CartPageProps) {
  const { cart, handleAddToCart, updateQuantity, removeFromCart, resetCart } = useCartService({
    products,
    onAddNotification,
  });

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const completeOrder = useCallback(() => {
    const orderNumber = `ORD-${Date.now()}`;
    onAddNotification(`주문이 완료되었습니다. 주문번호: ${orderNumber}`, 'success');
    resetCart();
    onResetSelectedCoupon();
  }, [onAddNotification, resetCart, onResetSelectedCoupon]);

  const totals = calculateCartTotal(cart, selectedCoupon);

  return (
    <>
      <CartHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setIsAdmin={setIsAdmin}
        cart={cart}
      />

      <main className='max-w-7xl mx-auto px-4 py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
          <div className='lg:col-span-3'>
            {/* 상품 목록 */}
            <section>
              <div className='mb-6 flex justify-between items-center'>
                <h2 className='text-2xl font-semibold text-gray-800'>전체 상품</h2>
                <div className='text-sm text-gray-600'>총 {products.length}개 상품</div>
              </div>
              <ProductList
                products={products}
                debouncedSearchTerm={debouncedSearchTerm}
                cart={cart}
                addToCart={handleAddToCart}
              />
            </section>
          </div>

          <div className='lg:col-span-1'>
            <div className='sticky top-24 space-y-4'>
              <section className='bg-white rounded-lg border border-gray-200 p-4'>
                <h2 className='text-lg font-semibold mb-4 flex items-center'>
                  <Icon name='cartBagRegular' width={20} height={20} className='mr-2' />
                  장바구니
                </h2>

                <CartItemList
                  cart={cart}
                  onRemoveFromCart={removeFromCart}
                  onUpdateQuantity={updateQuantity}
                />
              </section>

              {cart.length > 0 && (
                <>
                  <CouponSelector
                    coupons={coupons}
                    selectedCoupon={selectedCoupon}
                    onApplyCoupon={(coupon) => onApplyCoupon(cart, coupon)}
                    onResetSelectedCoupon={onResetSelectedCoupon}
                  />

                  <PaymentSummary totals={totals} completeOrder={completeOrder} />
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
