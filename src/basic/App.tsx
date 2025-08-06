import { useState } from 'react';

import type { Coupon } from '../types';
import { AdminPage } from './components/AdminPage';
import { CartPage } from './components/CartPage';
import { Notifications } from './components/ui/Notifications';
import { useCouponStore } from './hooks/useCouponStore';
import { useNotificationStore } from './hooks/useNotificationStore';
import { useProductStore } from './hooks/useProductStore';

const App = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProductStore();
  const { coupons, addCoupon, deleteCoupon } = useCouponStore();
  const { notifications, addNotification, removeNotification } = useNotificationStore();

  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  return (
    <div className='min-h-screen bg-gray-50'>
      <Notifications notifications={notifications} onRemoveNotification={removeNotification} />

      {isAdmin ? (
        <AdminPage
          setIsAdmin={setIsAdmin}
          // products
          products={products}
          onAddProduct={addProduct}
          onUpdateProduct={updateProduct}
          onDeleteProduct={deleteProduct}
          // coupons
          coupons={coupons}
          onAddCoupon={addCoupon}
          onDeleteCoupon={deleteCoupon}
          // selectedCoupon
          selectedCoupon={selectedCoupon}
          setSelectedCoupon={setSelectedCoupon}
          // notifications
          onAddNotification={addNotification}
        />
      ) : (
        <CartPage
          setIsAdmin={setIsAdmin}
          // products
          products={products}
          // coupons
          coupons={coupons}
          selectedCoupon={selectedCoupon}
          setSelectedCoupon={setSelectedCoupon}
          // notifications
          onAddNotification={addNotification}
        />
      )}
    </div>
  );
};

export default App;
