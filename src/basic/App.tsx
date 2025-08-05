import { useState, useCallback, useEffect } from 'react';

import type { Coupon, Notification as NotificationType, NotificationVariant } from '../types';
import { AdminPage } from './components/AdminPage';
import { CartPage } from './components/CartPage';
import { Notifications } from './components/ui/Notifications';
import { initialCoupons, initialProducts, type ProductWithUI } from './constants';

const App = () => {
  const [products, setProducts] = useState<ProductWithUI[]>(() => {
    const saved = localStorage.getItem('products');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialProducts;
      }
    }
    return initialProducts;
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('coupons');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialCoupons;
      }
    }
    return initialCoupons;
  });

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

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('coupons', JSON.stringify(coupons));
  }, [coupons]);

  return (
    <div className='min-h-screen bg-gray-50'>
      <Notifications notifications={notifications} setNotifications={setNotifications} />

      {isAdmin ? (
        <AdminPage
          setIsAdmin={setIsAdmin}
          addNotification={addNotification}
          // products
          products={products}
          setProducts={setProducts}
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
