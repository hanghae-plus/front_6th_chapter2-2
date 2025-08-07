import { ProductWithUI, CartItem, Coupon } from '../../../types';
import Cart from '../cart/Cart';
import ProductList from '../product/ProductList';

interface CartPageProps {
  isAdmin: boolean;
  cart: CartItem[];
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  setSelectedCoupon: (coupon: Coupon | null) => void;
  handleApplyCoupon: (coupon: Coupon) => void;
  handleCompleteOrder: () => void;
  totals: {
    totalBeforeDiscount: number;
    totalAfterDiscount: number;
  };
}

const CartPage = ({
  isAdmin,
  cart,
  coupons,
  selectedCoupon,
  setSelectedCoupon,
  handleApplyCoupon,
  handleCompleteOrder,
  totals,
}: CartPageProps) => {
  return (
    <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
      <div className='lg:col-span-3'>
        <ProductList isAdmin={isAdmin} />
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
