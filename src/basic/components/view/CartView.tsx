import ProductList from '../product/ProductList.tsx';
import CartList from '../cart/CartList.tsx';
import { CartItem, Coupon, Product } from '../../models/entities';

interface CartViewProps {
  cart: CartItem[];
  // selectedCoupon: Coupon | null;
  coupons: Coupon[];
  addToCart: (product: Product) => void;
  onRemoveFromCart: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onApplyCoupon: (coupon: Coupon) => void;
  onResetCart: () => void;
  debouncedSearchTerm: string;
}

const CartView = ({
  debouncedSearchTerm,
  cart,
  addToCart,
  // selectedCoupon,
  onRemoveFromCart,
  onUpdateQuantity,
  onApplyCoupon,
  onResetCart,
  coupons,
}: CartViewProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        {/* 상품 목록 */}
        <ProductList
          debouncedSearchTerm={debouncedSearchTerm}
          cart={cart}
          addToCart={addToCart}
        />
      </div>

      <CartList
        cart={cart}
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

export default CartView;
