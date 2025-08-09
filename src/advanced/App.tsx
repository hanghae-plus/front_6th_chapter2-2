import { useState } from 'react';
import { Header, Notifications } from './ui';
import { AdminDashboard, UserDashboard } from './pages';
import { useProducts, AppProvider } from './contexts';
import { useFilteredProducts } from '@/shared/hooks/use-filtered-products';

function AppContent() {
  const [isAdmin, setIsAdmin] = useState(false);
  const { products } = useProducts();
  const { searchTerm, setSearchTerm, debouncedSearchTerm, filteredProducts } =
    useFilteredProducts(products);

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
