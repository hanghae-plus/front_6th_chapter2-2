import { useState, useCallback } from 'react';
import { useAtom } from 'jotai';

import { Coupon, ProductWithUI } from '../types';
import { addNotificationAtom } from './store/actions';
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

  const {
    cart,
    selectedCoupon,
    setSelectedCoupon,
    totalItemCount,
    calculateCartTotal,
    addToCart,
    applyCoupon,
    getRemainingStock,
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

  const handleAddToCart = useCallback(
    (product: ProductWithUI) => {
      addToCart(product, handleAddNotification);
    },
    [addToCart, handleAddNotification]
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

  const [isAdmin, setIsAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const totals = calculateCartTotal();

  return (
    <div className='min-h-screen bg-gray-50'>
      <NotificationComponent />
      <Header
        isAdmin={isAdmin}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setIsAdmin={setIsAdmin}
        cart={cart}
        totalItemCount={totalItemCount}
      />

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
            debouncedSearchTerm={debouncedSearchTerm}
            isAdmin={isAdmin}
            products={products}
            cart={cart}
            coupons={coupons}
            selectedCoupon={selectedCoupon}
            setSelectedCoupon={setSelectedCoupon}
            handleAddToCart={handleAddToCart}
            handleApplyCoupon={handleApplyCoupon}
            handleCompleteOrder={handleCompleteOrder}
            getRemainingStock={getRemainingStock}
            totals={totals}
          />
        )}
      </main>
    </div>
  );
};

export default App;
