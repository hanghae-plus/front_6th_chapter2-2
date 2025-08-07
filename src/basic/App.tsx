import { useState } from 'react';
import { AdminPage, MainPage } from './pages';
import { Header, Notification } from './components';
import { useDebounce, useLocalStorage, useNotification } from './hooks';
import { initialProducts, ProductWithUI } from './entities/product';
import { initialCoupons } from './entities/coupon';
import { CartItemType, CouponType } from '@/types';

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  const [products, setProducts] = useLocalStorage<ProductWithUI[]>('products', initialProducts);
  const [cart, setCart] = useLocalStorage<CartItemType[]>('cart', []);
  const [coupons, setCoupons] = useState<CouponType[]>(initialCoupons);

  const { searchTerm, setSearchTerm, debouncedSearchTerm } = useDebounce();
  const { notifications, setNotifications, addNotification } = useNotification();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 알림 메시지 표시 영역 */}
      <Notification notifications={notifications} setNotifications={setNotifications} />

      {/* 헤더 영역 */}
      <Header
        isAdmin={isAdmin}
        cart={cart}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setIsAdmin={setIsAdmin}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? (
          // 관리자 대시보드
          <AdminPage
            products={products}
            setProducts={setProducts}
            cart={cart}
            coupons={coupons}
            setCoupons={setCoupons}
            addNotification={addNotification}
          />
        ) : (
          // 쇼핑몰 메인 페이지
          <MainPage
            products={products}
            cart={cart}
            setCart={setCart}
            coupons={coupons}
            setCoupons={setCoupons}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            debouncedSearchTerm={debouncedSearchTerm}
            addNotification={addNotification}
          />
        )}
      </main>
    </div>
  );
};

export default App;
