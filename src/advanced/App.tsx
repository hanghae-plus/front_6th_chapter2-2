import { useState } from 'react';
import { AdminPage } from './components/admin-page/AdminPage';
import { AdminPageHeader } from './components/admin-page/AdminPageHeader';
import { CartPage } from './components/cart-page/CartPage';
import { CartPageHeader } from './components/cart-page/CartPageHeader';
import { Notifications } from './components/Notifications';
import { useOrder } from './hooks/useOrder';
import { useProducts } from './hooks/useProducts';
import { useDebounce } from './utils/hooks/useDebounce';

const App = () => {
  const { products, deleteProduct } = useProducts();
  const { completeOrder } = useOrder();

  const [isAdmin, setIsAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce({ delay: 500, value: searchTerm });

  return (
    <div className="min-h-screen bg-gray-50">
      <Notifications />

      {isAdmin ? (
        <AdminPageHeader setIsAdmin={setIsAdmin} />
      ) : (
        <CartPageHeader
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          setIsAdmin={setIsAdmin}
        />
      )}

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? (
          <AdminPage products={products} deleteProduct={deleteProduct} />
        ) : (
          <CartPage
            searchTerm={debouncedSearchTerm}
            products={products}
            completeOrder={completeOrder}
          />
        )}
      </main>
    </div>
  );
};

export default App;
