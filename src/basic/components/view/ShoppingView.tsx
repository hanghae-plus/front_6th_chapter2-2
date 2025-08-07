import CheckOutArea from '../shop/checkout/checkoutInfo/CheckOutArea.tsx';
import CartArea from '../shop/checkout/cart/CartArea.tsx';
import {
  CartItem,
  Coupon,
  Product,
  ProductWithUI,
} from '../../models/entities';

interface CartViewProps {
  cart: CartItem[];
  products: ProductWithUI[];
  coupons: Coupon[];
  addNotification: (
    message: string,
    type?: 'error' | 'success' | 'warning'
  ) => void;
  addToCart: (product: Product) => void;
  onRemoveFromCart: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onApplyCoupon: (coupon: Coupon) => void;
  onResetCart: () => void;
  selectedCoupon: Coupon | null;
  debouncedSearchTerm: string;
  onResetCoupon: () => void;
}

const ShoppingView = ({
  debouncedSearchTerm,
  cart,
  selectedCoupon,
  addToCart,
  addNotification,
  onRemoveFromCart,
  onUpdateQuantity,
  onApplyCoupon,
  onResetCart,
  coupons,
  products,
  onResetCoupon,
}: CartViewProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        {/* 상품 목록 */}
        <CheckOutArea
          products={products}
          debouncedSearchTerm={debouncedSearchTerm}
          cart={cart}
          addToCart={addToCart}
        />
      </div>

      <CartArea
        selectedCoupon={selectedCoupon}
        onResetCoupon={onResetCoupon}
        cart={cart}
        addNotification={addNotification}
        onRemoveFromCart={onRemoveFromCart}
        onUpdateQuantity={onUpdateQuantity}
        onApplyCoupon={onApplyCoupon}
        onResetCart={onResetCart}
        coupons={coupons}
        addToCart={addToCart}
      />
    </div>
  );
};

export default ShoppingView;
