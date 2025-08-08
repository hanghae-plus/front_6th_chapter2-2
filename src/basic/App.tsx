import { useState } from 'react';

import type { Notification as TNotification } from '../types';
import Header from './components/Header';
import Notification from './components/Notification';
import { useCart } from './hooks/useCart';
import { AdminPage } from './pages/AdminPage';
import { CartPage } from './pages/CartPage';

// TODO: 메인 App 컴포넌트
// 힌트:
// 1. isAdmin 상태를 관리하여 쇼핑몰/관리자 모드 전환
// 2. 네비게이션 바에 모드 전환 버튼 포함
// 3. 조건부 렌더링으로 CartPage 또는 AdminPage 표시
// 4. 상태 관리는 각 페이지 컴포넌트에서 처리 (App은 라우팅만 담당)

const App = () => {
  const { cart, addToCart, updateQuantity, removeFromCart, clearCart, getRemainingStock } =
    useCart();

  const [isAdmin, setIsAdmin] = useState(false);
  const [notifications, setNotifications] = useState<TNotification[]>([]);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  return (
    <div className='min-h-screen bg-gray-50'>
      {notifications.length > 0 && (
        <Notification notifications={notifications} setNotifications={setNotifications} />
      )}

      <Header
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
        setDebouncedSearchTerm={setDebouncedSearchTerm}
        cart={cart}
      />

      <main className='max-w-7xl mx-auto px-4 py-8'>
        {isAdmin ? (
          <AdminPage getRemainingStock={getRemainingStock} setNotifications={setNotifications} />
        ) : (
          <CartPage
            cart={cart}
            debouncedSearchTerm={debouncedSearchTerm}
            clearCart={clearCart}
            updateQuantity={updateQuantity}
            removeFromCart={removeFromCart}
            addToCart={addToCart}
            getRemainingStock={getRemainingStock}
            setNotifications={setNotifications}
          />
        )}
      </main>
    </div>
  );
};

export default App;
