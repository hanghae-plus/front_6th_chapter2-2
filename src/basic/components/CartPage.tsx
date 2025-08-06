import { useCallback, useState } from 'react';

import type { Coupon, NotificationVariant } from '../../types';
import type { ProductWithUI } from '../constants';
import { Icon } from './icons';
import { calculateCartTotal, getRemainingStock } from '../models/entity';
import { CartHeader } from './ui/CartHeader';
import { CartItemList } from './ui/CartItemList';
import { CouponSelector } from './ui/CouponSelector';
import { PaymentSummary } from './ui/PaymentSummary';
import { ProductList } from './ui/ProductList';
import { useCartStore } from '../hooks/useCartStore';
import { useDebounce } from '../utils/hooks/useDebounce';

interface CartPageProps {
  setIsAdmin: (isAdmin: boolean) => void;

  products: ProductWithUI[];

  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  setSelectedCoupon: (coupon: Coupon | null) => void;

  onAddNotification: (message: string, type: NotificationVariant) => void;
}

export function CartPage({
  setIsAdmin,

  products,

  coupons,
  selectedCoupon,
  setSelectedCoupon,

  onAddNotification,
}: CartPageProps) {
  const { cart, addToCart, updateToCart, removeFromCart, resetCart } = useCartStore();

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const applyCoupon = useCallback(
    (coupon: Coupon) => {
      const currentTotal = calculateCartTotal(cart, selectedCoupon).totalAfterDiscount;

      if (currentTotal < 10000 && coupon.discountType === 'percentage') {
        onAddNotification('percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.', 'error');
        return;
      }

      setSelectedCoupon(coupon);
      onAddNotification('쿠폰이 적용되었습니다.', 'success');
    },
    [onAddNotification, calculateCartTotal]
  );

  const completeOrder = useCallback(() => {
    const orderNumber = `ORD-${Date.now()}`;
    onAddNotification(`주문이 완료되었습니다. 주문번호: ${orderNumber}`, 'success');
    resetCart();
    setSelectedCoupon(null);
  }, [onAddNotification, resetCart]);

  const handleAddToCart = useCallback(
    (product: ProductWithUI) => {
      const remainingStock = getRemainingStock(product, cart);
      if (remainingStock <= 0) {
        onAddNotification('재고가 부족합니다!', 'error');
        return;
      }

      const existingItem = cart.find((item) => item.product.id === product.id);

      if (existingItem) {
        const newQuantity = existingItem.quantity + 1;

        if (newQuantity > product.stock) {
          onAddNotification(`재고는 ${product.stock}개까지만 있습니다.`, 'error');
          return;
        }

        updateToCart(product, newQuantity);
        return;
      }

      addToCart(product);
      onAddNotification('장바구니에 담았습니다', 'success');
    },
    [cart, onAddNotification, addToCart, updateToCart]
  );

  const updateQuantity = useCallback(
    (productId: string, newQuantity: number) => {
      if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
      }

      const product = products.find((p) => p.id === productId);
      if (!product) return;

      const maxStock = product.stock;
      if (newQuantity > maxStock) {
        onAddNotification(`재고는 ${maxStock}개까지만 있습니다.`, 'error');
        return;
      }

      updateToCart(product, newQuantity);
    },
    [products, removeFromCart, onAddNotification, updateToCart]
  );

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
                    onApplyCoupon={applyCoupon}
                    onResetSelectedCoupon={() => setSelectedCoupon(null)}
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
