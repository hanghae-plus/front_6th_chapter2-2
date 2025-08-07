import { useState, useMemo } from 'react';
import { Header, NotificationItem } from './ui';
import { ProductModel } from './models';
import { useDebounceValue } from './hooks';
import { AdminDashboard, UserDashboard } from './pages';
import { useNotifications, useProducts, AppProvider } from './contexts';

function AppContent() {
  const [isAdmin, setIsAdmin] = useState(false);
  const { notifications, removeNotification } = useNotifications();
  const { products } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');

  const debouncedSearchTerm = useDebounceValue(searchTerm, 500);

  const filteredProducts = useMemo(() => {
    const productModel = new ProductModel(products);
    return productModel.filter(debouncedSearchTerm);
  }, [products, debouncedSearchTerm]);

  return (
    <div className='min-h-screen bg-gray-50'>
      {notifications.length > 0 && (
        <div className='fixed top-20 right-4 z-50 space-y-2 max-w-sm'>
          {notifications.map((notif) => (
            <NotificationItem
              key={notif.id}
              notif={notif}
              onClose={() => removeNotification(notif.id)}
            />
          ))}
        </div>
      )}
      <Header
        isAdmin={isAdmin}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setIsAdmin={setIsAdmin}
      />
      <main className='max-w-7xl mx-auto px-4 py-8'>
        {isAdmin ? (
          <AdminDashboard isAdmin={isAdmin} />
        ) : (
          <UserDashboard
            filteredProducts={filteredProducts}
            debouncedSearchTerm={debouncedSearchTerm}
            isAdmin={isAdmin}
          />
        )}
      </main>
    </div>
  );
}

const App = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
