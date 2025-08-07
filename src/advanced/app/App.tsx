import { useState } from 'react';

import { NotificationList } from '../entities/notification';
import { useCouponService } from '../hooks/useCouponService';
import { useProductService } from '../hooks/useProductService';
import { AdminPage } from '../pages/admin';
import { CartPage } from '../pages/cart';

export const App = () => {
  const { products, onAddProduct, onUpdateProduct, onDeleteProduct } = useProductService();
  const {
    coupons,
    selectedCoupon,
    onResetSelectedCoupon,
    onAddCoupon,
    onDeleteCoupon,
    onApplyCoupon,
  } = useCouponService();

  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <div className='min-h-screen bg-gray-50'>
      <NotificationList />

      {isAdmin ? (
        <AdminPage
          onChangeCartPage={() => setIsAdmin(false)}
          // products
          products={products}
          onAddProduct={onAddProduct}
          onUpdateProduct={onUpdateProduct}
          onDeleteProduct={onDeleteProduct}
          // coupons
          coupons={coupons}
          onAddCoupon={onAddCoupon}
          onDeleteCoupon={onDeleteCoupon}
        />
      ) : (
        <CartPage
          onChangeAdminPage={() => setIsAdmin(true)}
          // products
          products={products}
          // coupons
          coupons={coupons}
          selectedCoupon={selectedCoupon}
          onResetSelectedCoupon={onResetSelectedCoupon}
          onApplyCoupon={onApplyCoupon}
        />
      )}
    </div>
  );
};
