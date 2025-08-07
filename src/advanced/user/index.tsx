import { CartList } from './components/cart/CartList';
import { CouponSelectBox } from './components/coupon/CouponSelectBox';
import { PaymentInfoBox } from './components/payment/PaymentInfoBox';
import { ProductList } from './components/products/ProductList';
import { useCart } from '../shared/hooks/useCart';

export const UserPage = () => {
  const { cart } = useCart();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        {/* 상품 목록 */}
        <ProductList />
      </div>

      <div className="lg:col-span-1">
        <div className="sticky top-24 space-y-4">
          <CartList />

          {cart.length > 0 && (
            <>
              <CouponSelectBox />
              <PaymentInfoBox />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
