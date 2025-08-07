import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { useNotification } from './hooks/useNotification';
import { useCart } from './hooks/useCart';
import Header from './components/ui/layout/Header';
import Notification from './components/ui/notification/Notification';
import { isAdminAtom, totalItemCountAtom } from './store/atoms';

import AdminPage from './components/AdminPage';
import ShopPage from './components/ShopPage';

const App = () => {
  const { notifications, setNotifications } = useNotification();
  const { cart } = useCart();
  const [isAdmin] = useAtom(isAdminAtom);
  const [, setTotalItemCount] = useAtom(totalItemCountAtom);

  useEffect(() => {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    setTotalItemCount(count);
  }, [cart, setTotalItemCount]);

  return (
    <div className='min-h-screen bg-gray-50'>
      <Notification notifications={notifications} setNotifications={setNotifications} />
      <Header />

      <main className='max-w-7xl mx-auto px-4 py-8'>{isAdmin ? <AdminPage /> : <ShopPage />}</main>
    </div>
  );
};

export default App;
