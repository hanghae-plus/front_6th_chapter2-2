import { useAtom } from 'jotai';

import { isAdminAtom } from './atoms';
import { AdminPage } from './components/AdminPage';
import { CartPage } from './components/CartPage';
import { Header } from './components/Header';
import { NotificationPanel } from './components/NotificationPanel';

const App = () => {
  const [isAdmin] = useAtom(isAdminAtom);

  return (
    <div className='min-h-screen bg-gray-50'>
      <NotificationPanel />
      <Header />
      <main className='max-w-7xl mx-auto px-4 py-8'>{isAdmin ? <AdminPage /> : <CartPage />}</main>
    </div>
  );
};

export default App;
