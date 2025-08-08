import { useAtomValue } from 'jotai';
import { useState, useCallback, useEffect } from 'react';

import { Product } from '../../types';
import { isAdminAtom } from '../atoms/isAdminAtom';
import Header from '../components/Header';
import AdminPage from '../components/pages/AdminPage';
import CartPage from '../components/pages/CartPage';
import UIToast from '../components/ui/UIToast';
import { useCart } from '../hooks/useCart';
import { useCoupons } from '../hooks/useCouponts';
import { useProducts } from '../hooks/useProducts';
import { getRemainingStock } from '../utils/calculateItem';
import { filterProductsBySearchTerm } from '../utils/filterProducts';

export interface ProductWithUI extends Product {
  description?: string;
  isRecommended?: boolean;
}

export interface Notification {
  id: string;
  message: string;
  type: 'error' | 'success' | 'warning';
}

const App = () => {
  const { products, deleteProduct } = useProducts();
  const isAdmin = useAtomValue(isAdminAtom);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState<'products' | 'coupons'>('products');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchProductName, setSearchProductName] = useState('');

  // Admin

  // 쿠폰 입력폼

  // 숫자포매팅
  const formatPrice = (price: number, productId?: string): string => {
    if (productId) {
      const product = products.find((p) => p.id === productId);
      if (product && getRemainingStock(product, cart) <= 0) {
        return 'SOLD OUT';
      }
    }

    if (isAdmin) {
      return `${price.toLocaleString()}원`;
    }

    return `₩${price.toLocaleString()}`;
  };

  // 재교 확인

  // 알림추가
  const addNotification = useCallback(
    (message: string, type: 'error' | 'success' | 'warning' = 'success') => {
      const id = Date.now().toString();
      setNotifications((prev) => [...prev, { id, message, type }]);

      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, 3000);
    },
    [],
  );

  const { cart, setCart, totalItemCount, addToCart, removeFromCart, updateQuantity } =
    useCart(addNotification);
  const { coupons, setCoupons, selectedCoupon, setSelectedCoupon, applyCoupon } = useCoupons(
    cart,
    addNotification,
  );

  // 검색시
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchProductName(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const completeOrder = useCallback(() => {
    const orderNumber = `ORD-${Date.now()}`;
    addNotification(`주문이 완료되었습니다. 주문번호: ${orderNumber}`, 'success');
    setCart([]);
    setSelectedCoupon(null);
  }, [addNotification]);

  const filteredProducts = filterProductsBySearchTerm(products, searchProductName);

  return (
    <div className='min-h-screen bg-gray-50'>
      {notifications.length > 0 && (
        <UIToast notifications={notifications} setNotifications={setNotifications} />
      )}
      <Header
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        cart={cart}
        totalItemCount={totalItemCount}
      />

      <main className='max-w-7xl mx-auto px-4 py-8'>
        {isAdmin ? (
          <AdminPage
            setActiveTab={setActiveTab}
            activeTab={activeTab}
            products={products}
            formatPrice={formatPrice}
            addNotification={addNotification}
            coupons={coupons}
            setCoupons={setCoupons}
            deleteProduct={deleteProduct}
            setSelectedCoupon={setSelectedCoupon}
            selectedCoupon={selectedCoupon}
          />
        ) : (
          <CartPage
            products={products}
            filteredProducts={filteredProducts}
            searchProductName={searchProductName}
            cart={cart}
            formatPrice={formatPrice}
            coupons={coupons}
            selectedCoupon={selectedCoupon}
            setSelectedCoupon={setSelectedCoupon}
            completeOrder={completeOrder}
            setCart={setCart}
            addNotification={addNotification}
            addToCart={addToCart}
            applyCoupon={applyCoupon}
            removeFromCart={removeFromCart}
            updateQuantity={updateQuantity}
          />
        )}
      </main>
    </div>
  );
};

export default App;
