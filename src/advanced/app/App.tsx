import { useState } from 'react';

import { AdminPage } from '../components/AdminPage';
import { CartPage } from '../components/CartPage';
import { Notifications } from '../components/ui/Notifications';
import { useCouponService } from '../hooks/useCouponService';
import { useNotificationStore } from '../hooks/useNotificationStore';
import { useProductService } from '../hooks/useProductService';

export const App = () => {
  const { notifications, addNotification, removeNotification } = useNotificationStore();

  const { products, onAddProduct, onUpdateProduct, onDeleteProduct } = useProductService({
    onAddNotification: addNotification,
  });
  const {
    coupons,
    selectedCoupon,
    onResetSelectedCoupon,
    onAddCoupon,
    onDeleteCoupon,
    onApplyCoupon,
  } = useCouponService({
    onAddNotification: addNotification,
  });

  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <div className='min-h-screen bg-gray-50'>
      <Notifications notifications={notifications} onRemoveNotification={removeNotification} />

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
          // notifications
          onAddNotification={addNotification}
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
          // notifications
          onAddNotification={addNotification}
        />
      )}
    </div>
  );
};
