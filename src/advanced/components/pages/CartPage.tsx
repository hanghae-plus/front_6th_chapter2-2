import { ProductWithUI, CartItem, Coupon } from '../../../types';
import Cart from '../cart/Cart';
import ProductList from '../product/ProductList';

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
          totals={totals}
        />
      </div>
    </div>
  );
};

export default CartPage;
