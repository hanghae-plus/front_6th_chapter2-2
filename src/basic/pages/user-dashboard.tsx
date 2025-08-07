import { CartItem, Coupon, Product } from '@/types';
import { ProductWithUI } from '../constants/mocks';
import { Cart, Coupons, Payments, ProductList } from '../ui/index';

interface UserDashboardProps {
  // 상품
  products: ProductWithUI[];
  filteredProducts: ProductWithUI[];
  debouncedSearchTerm: string;
  isAdmin: boolean;

  // 장바구니
  cart: CartItem[];
  addToCart: (product: ProductWithUI) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, newQuantity: number) => void;
  getStock: (product: Product) => number;

  // 쿠폰 & 결제
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  applyCoupon: (coupon: Coupon) => void;
  setSelectedCoupon: (coupon: Coupon | null) => void;
  totals: { totalBeforeDiscount: number; totalAfterDiscount: number };
  completeOrder: () => void;
}

export function UserDashboard({
  products,
  filteredProducts,
  debouncedSearchTerm,
  isAdmin,
  cart,
  addToCart,
  removeFromCart,
  updateQuantity,
  getStock,
  coupons,
  selectedCoupon,
  applyCoupon,
  setSelectedCoupon,
  totals,
  completeOrder,
}: UserDashboardProps) {
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
