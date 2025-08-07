import { CartItem, Coupon, Product } from '../../types';
import { OrderSummary } from './cart-page/OrderSummary';
import { ProductList } from './cart-page/ProductList';

interface CartPageProps {
  products: Product[];
  cart: CartItem[];
  coupons: Coupon[];
  totals: {
    totalBeforeDiscount: number;
    totalAfterDiscount: number;
  };
  searchTerm: string;
  selectedCoupon: Coupon | null;
  applyCoupon: (coupon: Coupon) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, newQuantity: number) => void;
  getRemainingStock: (product: Product) => number;
  clearCart: () => void;
  addNotification: (message: string, type?: 'error' | 'success' | 'warning') => void;
}

export function CartPage({
  products,
  cart,
  coupons,
  totals,
  searchTerm,
  selectedCoupon,
  applyCoupon,
  addToCart,
  removeFromCart,
  updateQuantity,
  getRemainingStock,
  clearCart,
  addNotification,
}: CartPageProps) {
  return (
    <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
      <ProductList
        products={products}
        searchTerm={searchTerm}
        getRemainingStock={getRemainingStock}
        addToCart={addToCart}
      />
      <OrderSummary
        cart={cart}
        coupons={coupons}
        selectedCoupon={selectedCoupon}
        totals={totals}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
        clearCart={clearCart}
        applyCoupon={applyCoupon}
        addNotification={addNotification}
      />
    </div>
  );
}
