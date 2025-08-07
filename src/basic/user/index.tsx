import { CartList } from './components/cart/CartList';
import { CouponSelectBox } from './components/coupon/CouponSelectBox';
import { PaymentInfoBox } from './components/payment/PaymentInfoBox';
import { ProductList } from './components/products/ProductList';
import {
  CouponActions,
  CartActions,
  NotificationActions,
  ProductsActions,
  AppState,
} from '../shared/types';

export const UserPage = ({
  appState,
  productsActions,
  couponActions,
  cartActions,
  notificationActions,
}: {
  appState: AppState;
  productsActions: ProductsActions;
  couponActions: CouponActions;
  cartActions: CartActions;
  notificationActions: NotificationActions;
}) => {
  const { cart } = cartActions;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        {/* 상품 목록 */}
        <ProductList
          appState={appState}
          productsActions={productsActions}
          cartActions={cartActions}
        />
      </div>

      <div className="lg:col-span-1">
        <div className="sticky top-24 space-y-4">
          <CartList cartActions={cartActions} />

          {cart.length > 0 && (
            <>
              <CouponSelectBox
                couponActions={couponActions}
                cartActions={cartActions}
              />
              <PaymentInfoBox
                cartActions={cartActions}
                notificationActions={notificationActions}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
