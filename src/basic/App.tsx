import { useState, useEffect } from 'react';

import { AdminPage } from './components/AdminPage';
import { CartPage } from './components/CartPage';
import { Header } from './components/Header';
import { NotificationPanel } from './components/NotificationPanel';
import { useCart } from './hooks/useCart';
import { useCoupons } from './hooks/useCoupons';
import { useNotifications } from './hooks/useNotifications';
import { useProducts } from './hooks/useProducts';

import * as cartModel from './models/cart';

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  const { notifications, setNotifications, addNotification } = useNotifications();

  const { products, addProduct, updateProduct, deleteProduct } = useProducts({ addNotification });

  const { cart, addToCart, removeFromCart, updateQuantity, getRemainingStock, clearCart } = useCart(
    { products, addNotification },
  );
  const { coupons, addCoupon, selectedCoupon, applyCoupon, deleteCoupon } = useCoupons({
    addNotification,
  });

  const totals = cartModel.calculateCartTotal(cart, selectedCoupon);

  const formatPrice = (price: number, productId?: string): string => {
    if (productId) {
      const product = products.find((p) => p.id === productId);
      if (product && getRemainingStock(product) <= 0) {
        return 'SOLD OUT';
      }
    }
    if (isAdmin) {
      return `${price.toLocaleString()}원`;
    }

    return `₩${price.toLocaleString()}`;
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  return (
    <div className='min-h-screen bg-gray-50'>
      <NotificationPanel notifications={notifications} setNotifications={setNotifications} />
      <Header
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        cart={cart}
      />
      <main className='max-w-7xl mx-auto px-4 py-8'>
        {isAdmin ? (
          <AdminPage
            // --- 데이터 엔티티 ---
            products={products}
            coupons={coupons}
            // --- 상품 관련 핸들러 ---
            addProduct={addProduct}
            updateProduct={updateProduct}
            deleteProduct={deleteProduct}
            // --- 쿠폰 관련 핸들러 ---
            addCoupon={addCoupon}
            deleteCoupon={deleteCoupon}
            // --- 유틸 함수 ---
            formatPrice={formatPrice}
            addNotification={addNotification}
          />
        ) : (
          <CartPage
            // --- 데이터 엔티티 ---
            products={products}
            cart={cart}
            coupons={coupons}
            // --- 파생 데이터 ---
            totals={totals}
            // --- UI 상태 ---
            selectedCoupon={selectedCoupon}
            debouncedSearchTerm={debouncedSearchTerm}
            // --- 장바구니 관련 핸들러 ---
            addToCart={addToCart}
            removeFromCart={removeFromCart}
            updateQuantity={updateQuantity}
            getRemainingStock={getRemainingStock}
            // --- 쿠폰 관련 핸들러 ---
            applyCoupon={applyCoupon}
            // --- 주문 관련 핸들러 ---
            addNotification={addNotification}
            clearCart={clearCart}
            // --- 계산 및 포맷팅 유틸 함수 ---
            formatPrice={formatPrice}
          />
        )}
      </main>
    </div>
  );
};

export default App;
