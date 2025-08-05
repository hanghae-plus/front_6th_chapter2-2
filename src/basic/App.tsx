import { useState, useCallback } from 'react';

import type { Coupon, Notification as NotificationType, NotificationVariant } from '../types';
import { AdminPage } from './components/AdminPage';
import { CartPage } from './components/CartPage';
import { Notifications } from './components/ui/Notifications';
import { initialCoupons } from './constants';
import { useProductStore } from './hooks/useProductStore';
import { useLocalStorage } from './utils/hooks/useLocalStorage';

const App = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProductStore();
  const [coupons, setCoupons] = useLocalStorage<Coupon[]>('coupons', initialCoupons);

  const [isAdmin, setIsAdmin] = useState(false);
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const addNotification = useCallback(
    (message: string, variant: NotificationVariant = 'success') => {
      const id = Date.now().toString();
      setNotifications((prev) => [...prev, { id, message, variant }]);

      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, 3000);
    },
    []
  );

  return (
    <div className='min-h-screen bg-gray-50'>
      <Notifications notifications={notifications} setNotifications={setNotifications} />

      {isAdmin ? (
        <AdminPage
          setIsAdmin={setIsAdmin}
          addNotification={addNotification}
          // products
          products={products}
          onAddProduct={addProduct}
          onUpdateProduct={updateProduct}
          onDeleteProduct={deleteProduct}
          // coupons
          coupons={coupons}
          setCoupons={setCoupons}
          // selectedCoupon
          selectedCoupon={selectedCoupon}
          setSelectedCoupon={setSelectedCoupon}
        />
      ) : (
        <CartPage
          setIsAdmin={setIsAdmin}
          addNotification={addNotification}
          // products
          products={products}
          // coupons
          coupons={coupons}
          selectedCoupon={selectedCoupon}
          setSelectedCoupon={setSelectedCoupon}
        />
      )}
    </div>
  );
};

export default App;
