import { useState, useCallback, useEffect } from 'react';

import { AdminPage } from './components/AdminPage';
import { CartPage } from './components/CartPage';
import { Header } from './components/Header';
import { NotificationPanel } from './components/NotificationPanel';
import { useCart } from './hooks/useCart';
import { useCoupons } from './hooks/useCoupons';
import { useNotifications } from './hooks/useNotifications';
import { useProducts } from './hooks/useProducts';

const App = () => {
  const { notifications, setNotifications, addNotification } = useNotifications();

  const { products, addProduct, updateProduct, deleteProduct } = useProducts({ addNotification });

  const {
    cart,
    selectedCoupon,
    setSelectedCoupon,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    calculateItemTotal,
    calculateCartTotal,
    getRemainingStock,
    clearCart,
  } = useCart({ products, addNotification });

  const { coupons, addCoupon, deleteCoupon } = useCoupons({
    selectedCoupon,
    setSelectedCoupon,
    addNotification,
  });

  const [isAdmin, setIsAdmin] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

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

  const completeOrder = useCallback(() => {
    const orderNumber = `ORD-${Date.now()}`;
    addNotification(`주문이 완료되었습니다. 주문번호: ${orderNumber}`, 'success');
    clearCart();
  }, [addNotification]);


  const totals = calculateCartTotal();

  const filteredProducts = debouncedSearchTerm
    ? products.filter(
        (product) =>
          product.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          (product.description &&
            product.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase())),
      )
    : products;

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
            filteredProducts={filteredProducts}
            totals={totals}
            // --- UI 상태 ---
            selectedCoupon={selectedCoupon}
            debouncedSearchTerm={debouncedSearchTerm}
            // --- 장바구니 관련 핸들러 ---
            addToCart={addToCart}
            removeFromCart={removeFromCart}
            updateQuantity={updateQuantity}
            // --- 쿠폰 관련 핸들러 ---
            applyCoupon={applyCoupon}
            setSelectedCoupon={setSelectedCoupon}
            // --- 주문 관련 핸들러 ---
            completeOrder={completeOrder}
            // --- 계산 및 포맷팅 유틸 함수 ---
            getRemainingStock={getRemainingStock}
            calculateItemTotal={calculateItemTotal}
            formatPrice={formatPrice}
          />
        )}
      </main>
    </div>
  );
};

export default App;
