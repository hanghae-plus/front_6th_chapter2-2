import { useAtomValue } from 'jotai';

import { CartItemList } from '../../../components/ui/CartItemList';
import { CouponSelector } from '../../../components/ui/CouponSelector';
import { PaymentSummary } from '../../../components/ui/PaymentSummary';
import { ProductList } from '../../../components/ui/ProductList';
import { calculateCartTotal } from '../../../entities/cart';
import { productsAtom } from '../../../entities/product';
import { useCouponApplyService } from '../../../features/cart-coupon';
import { useCartService } from '../../../features/cart-management';
import { usePaymentService } from '../../../features/payment';
import { useDebouncedSearch } from '../../../features/search';
import { Icon } from '../../../shared/icon';
import { CartHeader } from '../../../widgets/cart-header';

interface CartPageProps {
  onChangeAdminPage: () => void;
}

export function CartPage({ onChangeAdminPage }: CartPageProps) {
  const products = useAtomValue(productsAtom);

  const { selectedCoupon, onApplyCoupon, resetSelectedCoupon } = useCouponApplyService();
  const { cart, handleAddToCart, updateQuantity, removeFromCart, resetCart } = useCartService({
    products,
  });
  const { completeOrder } = usePaymentService();
  const [searchTerm, debouncedSearchTerm, onChangeSearchTerm] = useDebouncedSearch();

  const totals = calculateCartTotal(cart, selectedCoupon);

  const handleCompleteOrder = () => {
    completeOrder(selectedCoupon);
    resetCart();
    resetSelectedCoupon();
  };

  return (
    <>
      <CartHeader
        searchTerm={searchTerm}
        cart={cart}
        onChangeSearchTerm={onChangeSearchTerm}
        onChangeAdminPage={onChangeAdminPage}
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
                  <CouponSelector onApplyCoupon={(coupon) => onApplyCoupon(cart, coupon)} />

                  <PaymentSummary totals={totals} completeOrder={handleCompleteOrder} />
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
