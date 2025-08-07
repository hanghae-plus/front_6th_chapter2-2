import { ProductWithUI, CartItem, Coupon } from '../../types';
import Cart from '../components/shopping/Cart';
import ProductList from '../components/shopping/ProductList';

interface CartPageProps {
  debouncedSearchTerm: string;
  isAdmin: boolean;
  products: ProductWithUI[];
  cart: CartItem[];
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  setSelectedCoupon: (coupon: Coupon | null) => void;
  handleAddToCart: (product: ProductWithUI) => void;
  handleApplyCoupon: (coupon: Coupon) => void;
  handleCompleteOrder: () => void;
  handleUpdateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  getRemainingStock: (product: ProductWithUI, cart: CartItem[]) => number;
  totals: {
    totalBeforeDiscount: number;
    totalAfterDiscount: number;
  };
}

const CartPage = ({
  debouncedSearchTerm,
  isAdmin,
  products,
  cart,
  coupons,
  selectedCoupon,
  setSelectedCoupon,
  handleAddToCart,
  handleApplyCoupon,
  handleCompleteOrder,
  handleUpdateQuantity,
  removeFromCart,
  getRemainingStock,
  totals,
}: CartPageProps) => {
  return (
    <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
      <div className='lg:col-span-3'>
        <ProductList
          debouncedSearchTerm={debouncedSearchTerm}
          isAdmin={isAdmin}
          products={products}
          cart={cart}
          handleAddToCart={handleAddToCart}
          getRemainingStock={getRemainingStock}
        />
      </div>
      <div className='lg:col-span-1'>
        <Cart
          cart={cart}
          coupons={coupons}
          selectedCoupon={selectedCoupon}
          setSelectedCoupon={setSelectedCoupon}
          handleApplyCoupon={handleApplyCoupon}
          handleCompleteOrder={handleCompleteOrder}
          handleUpdateQuantity={handleUpdateQuantity}
          removeFromCart={removeFromCart}
          totals={totals}
        />
      </div>
    </div>
  );
};

export default CartPage;
