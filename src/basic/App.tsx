import { useState, useCallback } from 'react';

import { Coupon, ProductWithUI, Notification } from '../types';
import Header from './components/common/Header';
import NotificationComponent from './components/common/Notification';
import { useCart } from './hooks/useCart';
import { useCoupons } from './hooks/useCoupons';
import { useProducts } from './hooks/useProducts';
import AdminPage from './pages/AdminPage';
import CartPage from './pages/CartPage';
import { useDebounce } from './utils/hooks/useDebounce';

const App = () => {
  // ===== 상태 관리 =====
  // useProducts Hook 사용
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();

  const [notifications, setNotifications] = useState<Notification[]>([]);

  // 알림 추가 함수
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

  // useCart Hook 사용
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
  } = useCart(products);

  // useCoupons Hook 사용
  const { coupons, addCoupon, removeCoupon } = useCoupons();

  // 알림 콜백 함수들
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

  // ===== localStorage 동기화 =====
  // products, cart, coupons는 각각의 custom hook 내부의 useLocalStorage를 통해 자동으로 동기화됩니다.

  // ===== UTILS: 유틸리티 함수들 =====
  // formatPrice 함수는 utils/formatters.ts로 분리됨

  // ===== MODELS: 순수 함수들 (UI와 관련된 로직 없음, 외부 상태에 의존하지 않음) =====

  const totals = calculateCartTotal();

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* ===== ENTITY COMPONENTS: 엔티티 컴포넌트들 ===== */}
      {/* TODO: src/basic/components/Notification.tsx로 분리 - 알림 시스템 */}
      <NotificationComponent
        notifications={notifications}
        onRemoveNotification={(id) => setNotifications((prev) => prev.filter((n) => n.id !== id))}
      />
      {/* TODO: src/basic/components/Header.tsx로 분리 - 헤더 (네비게이션, 검색) */}
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
          /* TODO: src/basic/components/AdminPage.tsx로 분리 - 관리자 페이지 */
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
