import { useAtom } from 'jotai';

import Header from './components/common/Header';
import NotificationComponent from './components/common/Notification';
import AdminPage from './components/pages/AdminPage';
import CartPage from './components/pages/CartPage';
import { isAdminAtom } from './store/atoms';

const App = () => {
  const [isAdmin] = useAtom(isAdminAtom);

  return (
    <div className='min-h-screen bg-gray-50'>
      <NotificationComponent />
      <Header />

      <main className='max-w-7xl mx-auto px-4 py-8'>{isAdmin ? <AdminPage /> : <CartPage />}</main>
    </div>
  );
};

export default App;
