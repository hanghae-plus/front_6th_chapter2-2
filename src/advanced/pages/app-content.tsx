import { useFilteredProducts } from '@/shared/hooks';
import { useState } from 'react';
import { Header, Notifications } from '../ui';
import { AdminDashboard } from './admin-dashboard';
import { UserDashboard } from './user-dashboard';
import { useProducts } from '../contexts';

export function AppContent() {
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
