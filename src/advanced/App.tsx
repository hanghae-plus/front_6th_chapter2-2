import { useState, useMemo } from 'react';
import { Header, Notifications } from './ui';
import { ProductModel } from './models';
import { useDebounceValue } from './hooks';
import { AdminDashboard, UserDashboard } from './pages';
import { useProducts, AppProvider } from './contexts';

function AppContent() {
  const [isAdmin, setIsAdmin] = useState(false);
  const { products } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');

  const debouncedSearchTerm = useDebounceValue(searchTerm, 500);

  const filteredProducts = useMemo(() => {
    const productModel = new ProductModel(products);
    return productModel.filter(debouncedSearchTerm);
  }, [products, debouncedSearchTerm]);

  return (
    <div className='min-h-screen bg-gray-50'>
      <Notifications />
      <Header
        isAdmin={isAdmin}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onToggleAdmin={() => setIsAdmin((prev) => !prev)}
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
