import { useState, useCallback } from 'react';
import { useAtom } from 'jotai';

import { Coupon, ProductWithUI } from '../types';
import { addNotificationAtom } from './store/actions';
import { isAdminAtom } from './store/atoms';
import Header from './components/common/Header';
import NotificationComponent from './components/common/Notification';
import AdminPage from './components/pages/AdminPage';
import CartPage from './components/pages/CartPage';
import { useCart } from './hooks/useCart';
import { useCoupons } from './hooks/useCoupons';
import { useProducts } from './hooks/useProducts';
import { useDebounce } from './utils/hooks/useDebounce';

const App = () => {
  // ===== 상태 관리 =====
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const [, addNotification] = useAtom(addNotificationAtom);
  const [isAdmin] = useAtom(isAdminAtom);

  const {
    cart,
    selectedCoupon,
    setSelectedCoupon,
    calculateCartTotal,
    applyCoupon,
    completeOrder,
  } = useCart();

  const { coupons, addCoupon, removeCoupon } = useCoupons();

  // ===== 이벤트 핸들러 =====
  const handleAddNotification = useCallback(
    (message: string, type: 'success' | 'error' | 'warning' = 'success') => {
      addNotification({ message, type });
    },
    [addNotification]
  );

  const handleApplyCoupon = useCallback(
    (coupon: Coupon) => {
      applyCoupon(coupon, handleAddNotification);
    },
    [applyCoupon, handleAddNotification]
  );

  const handleCompleteOrder = useCallback(() => {
    completeOrder(handleAddNotification);
  }, [completeOrder, handleAddNotification]);

  const totals = calculateCartTotal();

  return (
    <div className='min-h-screen bg-gray-50'>
      <NotificationComponent />
      <Header />

      <main className='max-w-7xl mx-auto px-4 py-8'>
        {isAdmin ? (
          <AdminPage
            products={products}
            cart={cart}
            coupons={coupons}
            selectedCoupon={selectedCoupon}
            setSelectedCoupon={setSelectedCoupon}
            addProduct={addProduct}
            updateProduct={updateProduct}
            deleteProduct={deleteProduct}
            addCoupon={addCoupon}
            removeCoupon={removeCoupon}
            addNotification={handleAddNotification}
          />
        ) : (
          <CartPage
            isAdmin={isAdmin}
            cart={cart}
            coupons={coupons}
            selectedCoupon={selectedCoupon}
            setSelectedCoupon={setSelectedCoupon}
            handleApplyCoupon={handleApplyCoupon}
            handleCompleteOrder={handleCompleteOrder}
            totals={totals}
          />
        )}
      </main>
    </div>
  );
};

export default App;
