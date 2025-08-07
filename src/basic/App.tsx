import { useState, useCallback } from 'react';
import { CartItem, Coupon } from '../types';
import { initialProducts } from './entities/product';
import { initialCoupons } from './entities/coupon';
import { calculateCartTotal } from './entities/cart';
import { useLocalStorage, useNotification } from './shared/hooks';
import { NotificationToast, Header } from './shared/ui';
import ShoppingPage from './pages/ShoppingPage';
import AdminPage from './pages/AdminPage';

const App = () => {
  // localStorage와 연동된 데이터 상태들
  const [products, setProducts] = useLocalStorage('products', initialProducts);
  const [cart, setCart] = useLocalStorage<CartItem[]>('cart', []);
  const [coupons, setCoupons] = useLocalStorage('coupons', initialCoupons);

  // UI 상태 관리
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // 알림 시스템
  const { notifications, addNotification, removeNotification } =
    useNotification();

  // 장바구니 전체 금액 계산 (쿠폰 할인 포함) - entities/cart 함수 사용
  const calculateCartTotalWithCoupon = useCallback((): {
    totalBeforeDiscount: number;
    totalAfterDiscount: number;
  } => {
    return calculateCartTotal(cart, selectedCoupon);
  }, [cart, selectedCoupon]);

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* 알림 시스템 */}
      <NotificationToast
        notifications={notifications}
        onRemove={removeNotification}
      />
      {/* 헤더 */}
      <Header
        isAdmin={isAdmin}
        searchTerm={searchTerm}
        cart={cart}
        onToggleAdmin={() => setIsAdmin(!isAdmin)}
        onSearchChange={setSearchTerm}
      />
      {/* 메인 컨텐츠 */}
      <main className='max-w-7xl mx-auto px-4 py-8'>
        {isAdmin ? (
          <AdminPage
            products={products}
            setProducts={setProducts}
            coupons={coupons}
            setCoupons={setCoupons}
            addNotification={addNotification}
          />
        ) : (
          <ShoppingPage
            products={products}
            searchTerm={searchTerm}
            cart={cart}
            setCart={setCart}
            coupons={coupons}
            selectedCoupon={selectedCoupon}
            setSelectedCoupon={setSelectedCoupon}
            addNotification={addNotification}
            calculateCartTotalWithCoupon={calculateCartTotalWithCoupon}
          />
        )}
      </main>
    </div>
  );
};

export default App;
