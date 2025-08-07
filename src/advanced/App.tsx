import { useState } from 'react';
import { NotificationToast, Header } from './shared/ui';
import ShoppingPage from './pages/ShoppingPage';
import AdminPage from './pages/AdminPage';

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* 알림 시스템 */}
      <NotificationToast />
      {/* 헤더 */}
      <Header isAdmin={isAdmin} onToggleAdmin={() => setIsAdmin(!isAdmin)} />
      {/* 메인 컨텐츠 */}
      <main className='max-w-7xl mx-auto px-4 py-8'>
        {isAdmin ? <AdminPage /> : <ShoppingPage />}
      </main>
    </div>
  );
};

export default App;
