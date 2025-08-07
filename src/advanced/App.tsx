import { type ReactNode } from 'react';
import { AdminPage } from './components/admin-page/AdminPage';
import { AdminPageHeader } from './components/admin-page/AdminPageHeader';
import { CartPageContainer } from './components/cart-page/CartPageContainer';
import { CartPageHeader } from './components/cart-page/CartPageHeader';
import { Notifications } from './components/Notifications';
import { usePage } from './hooks/page';

const App = () => {
  const page = usePage();

  const pageContent: Record<typeof page, ReactNode> = {
    admin: (
      <>
        <AdminPageHeader />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <AdminPage />
        </main>
      </>
    ),
    cart: (
      <>
        <CartPageHeader />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <CartPageContainer />
        </main>
      </>
    ),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Notifications />
      {pageContent[page]}
    </div>
  );
};

export default App;
