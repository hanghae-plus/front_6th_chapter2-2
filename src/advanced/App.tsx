import { useState } from 'react';
import { useAtom } from 'jotai';

import { addNotificationAtom } from './store/actions';
import Header from './components/common/Header';
import NotificationComponent from './components/common/Notification';
import AdminPage from './components/pages/AdminPage';
import CartPage from './components/pages/CartPage';

const App = () => {
  // ===== 상태 관리 =====
  const [, addNotification] = useAtom(addNotificationAtom);
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <div className='min-h-screen bg-gray-50'>
      <NotificationComponent />
      <Header isAdmin={isAdmin} setIsAdmin={setIsAdmin} />

      <main className='max-w-7xl mx-auto px-4 py-8'>
        {isAdmin ? (
          <AdminPage />
        ) : (
          <CartPage isAdmin={isAdmin} />
        )}
      </main>
    </div>
  );
};

export default App;
