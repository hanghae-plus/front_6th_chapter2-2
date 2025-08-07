import { Coupon } from '@/types';
import { ProductWithUI } from '../constants/mocks';
import { Cart, Coupons, Payments, ProductList } from '../ui/index';
import { useProducts, useCoupons, useCart } from '../contexts';

interface UserDashboardProps {
  filteredProducts: ProductWithUI[];
  debouncedSearchTerm: string;
  isAdmin: boolean;
  totals: { totalBeforeDiscount: number; totalAfterDiscount: number };
}

export function UserDashboard({
  filteredProducts,
  debouncedSearchTerm,
  isAdmin,
  totals,
}: UserDashboardProps) {
  const { products } = useProducts();
  const { coupons, selectedCoupon, setSelectedCoupon, applyCoupon } = useCoupons();
  const { cart, addToCart, removeFromCart, updateQuantity, getStock, completeOrder } = useCart();
  return (
    <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
      <div className='lg:col-span-3'>
        <ProductList
          products={products}
          filteredProducts={filteredProducts}
          debouncedSearchTerm={debouncedSearchTerm}
          getRemainingStock={getStock}
          isAdmin={isAdmin}
          addToCart={addToCart}
        />
      </div>

      <div className='lg:col-span-1'>
        <div className='sticky top-24 space-y-4'>
          <Cart cart={cart} removeFromCart={removeFromCart} updateQuantity={updateQuantity} />

          {cart.length > 0 && (
            <>
              <Coupons
                coupons={coupons}
                selectedCoupon={selectedCoupon}
                applyCoupon={applyCoupon}
                setSelectedCoupon={setSelectedCoupon}
              />
              {/* Payment */}
              <Payments totals={totals} completeOrder={completeOrder} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
