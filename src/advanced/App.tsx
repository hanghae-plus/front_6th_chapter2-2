import { useAtom } from 'jotai';

import { isAdminAtom } from './atoms/uiAtoms';
import { AdminPage } from './components/AdminPage';
import { CartPage } from './components/CartList';
import { Header } from './components/Header';
import { ProductCardList } from './components/ProductCardList';
import { Toast } from './components/Toast';

const App = () => {
  // UI atoms 사용
  const [isAdmin] = useAtom(isAdminAtom);

  return (
    <div className='min-h-screen bg-gray-50'>
      <Toast />

      <Header />
      <main className='max-w-7xl mx-auto px-4 py-8'>
        {isAdmin ? (
          <AdminPage />
        ) : (
          <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
            <ProductCardList />

            <CartPage />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
