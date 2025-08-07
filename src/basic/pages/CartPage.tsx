import { useCallback } from 'react';
import type { Coupon as CouponType } from '../../types';
import type { ProductWithUI } from '../shared/types';
import { MESSAGES } from '../constants/message';
import { ProductList } from '../components/cart/ProductList';
import { Cart } from '../components/cart/Cart';
import Payment from '../components/cart/Payment';
import Coupon from '../components/cart/Coupon';

interface CartPageProps {
  products: ProductWithUI[];
  filteredProducts: ProductWithUI[];
  searchTerm: string;
  cart: Array<{ product: ProductWithUI; quantity: number }>;
  coupons: CouponType[];
  selectedCoupon: CouponType | null;
  selectCoupon: (coupon: CouponType | null) => void;
  addToCart: (product: ProductWithUI, onSuccess: (message: string) => void, onError: (message: string) => void) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (
    productId: string,
    newQuantity: number,
    products: ProductWithUI[],
    onError: (message: string) => void,
  ) => void;
  applyCoupon: (coupon: CouponType, onSuccess: (message: string) => void, onError: (message: string) => void) => void;
  calculateTotal: () => { totalBeforeDiscount: number; totalAfterDiscount: number };
  getRemainingStock: (product: ProductWithUI) => number;
  clearCart: () => void;
  addNotification: (message: string, type: 'success' | 'error' | 'warning') => void;
}

export function CartPage({
  products,
  filteredProducts,
  searchTerm,
  cart,
  coupons,
  selectedCoupon,
  selectCoupon,
  addToCart: addToCartHook,
  removeFromCart,
  updateQuantity: updateQuantityHook,
  applyCoupon: applyCouponHook,
  calculateTotal,
  getRemainingStock,
  clearCart,
  addNotification,
}: CartPageProps) {
  const formatPrice = (price: number, productId?: string): string => {
    if (productId) {
      const product = products.find((p) => p.id === productId);
      if (product && getRemainingStock(product) <= 0) {
        return 'SOLD OUT';
      }
    }
    return `₩${price.toLocaleString()}`;
  };

  const addToCart = useCallback(
    (product: ProductWithUI) => {
      addToCartHook(
        product,
        (message) => addNotification(message, 'success'),
        (message) => addNotification(message, 'error'),
      );
    },
    [addToCartHook, addNotification],
  );

  const updateQuantity = useCallback(
    (productId: string, newQuantity: number) => {
      updateQuantityHook(productId, newQuantity, products, (message) => addNotification(message, 'error'));
    },
    [updateQuantityHook, products, addNotification],
  );

  const applyCoupon = useCallback(
    (coupon: CouponType) => {
      applyCouponHook(
        coupon,
        (message) => addNotification(message, 'success'),
        (message) => addNotification(message, 'error'),
      );
    },
    [applyCouponHook, addNotification],
  );

  const completeOrder = useCallback(() => {
    const orderNumber = `ORD-${Date.now()}`;
    addNotification(MESSAGES.ORDER.COMPLETED(orderNumber), 'success');
    clearCart();
  }, [addNotification, clearCart]);

  const totals = calculateTotal();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        {/* 상품 목록 */}
        <ProductList
          products={products}
          searchTerm={searchTerm}
          filteredProducts={filteredProducts}
          formatPrice={formatPrice}
          getRemainingStock={getRemainingStock}
          addToCart={addToCart}
        />
      </div>

      <div className="lg:col-span-1">
        <div className="sticky top-24 space-y-4">
          {/* 장바구니 */}
          <Cart
            cart={cart}
            removeFromCart={removeFromCart}
            updateQuantity={updateQuantity}
            calculateTotal={calculateTotal}
          />

          {cart.length > 0 && (
            <>
              {/* 쿠폰 섹션 */}
              <Coupon
                coupons={coupons}
                selectedCoupon={selectedCoupon}
                selectCoupon={selectCoupon}
                applyCoupon={applyCoupon}
              />
              {/* 결제 정보 */}
              <Payment totals={totals} completeOrder={completeOrder} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default CartPage;
