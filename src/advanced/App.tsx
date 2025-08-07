import { useState, useCallback } from 'react';

import { Coupon, ProductWithUI, Notification } from '../types';
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
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback(
    (message: string, type: 'success' | 'error' | 'warning' = 'success') => {
      const id = Date.now().toString();
      setNotifications((prev) => [...prev, { id, message, type }]);

      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, 3000);
    },
    []
  );

  const {
    cart,
    selectedCoupon,
    setSelectedCoupon,
    totalItemCount,
    calculateCartTotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    getRemainingStock,
    completeOrder,
  } = useCart();

  const { coupons, addCoupon, removeCoupon } = useCoupons();

  // ===== 이벤트 핸들러 =====
  const handleAddToCart = useCallback(
    (product: ProductWithUI) => {
      addToCart(product, addNotification);
    },
    [addToCart, addNotification]
  );

  const handleUpdateQuantity = useCallback(
    (productId: string, newQuantity: number) => {
      updateQuantity(productId, newQuantity, addNotification);
    },
    [updateQuantity, addNotification]
  );

  const handleApplyCoupon = useCallback(
    (coupon: Coupon) => {
      applyCoupon(coupon, addNotification);
    },
    [applyCoupon, addNotification]
  );

  const handleCompleteOrder = useCallback(() => {
    completeOrder(addNotification);
  }, [completeOrder, addNotification]);

  const [isAdmin, setIsAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const totals = calculateCartTotal();

  return (
    <div className='min-h-screen bg-gray-50'>
      <NotificationComponent
        notifications={notifications}
        onRemoveNotification={(id) => setNotifications((prev) => prev.filter((n) => n.id !== id))}
      />
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
            addNotification={addNotification}
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
            handleUpdateQuantity={handleUpdateQuantity}
            removeFromCart={removeFromCart}
            getRemainingStock={getRemainingStock}
            totals={totals}
          />
        )}
      </main>
    </div>
  );
};

export default App;
