import { useState, useEffect } from 'react';

import { AdminPage } from './components/AdminPage';
import { CartPage } from './components/CartPage';
import { Header } from './components/Header';
import { NotificationPanel } from './components/NotificationPanel';
import { useStore } from './hooks/useStore';

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');

  const {
    notifications,
    addNotification,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    getRemainingStock,
    clearCart,
    coupons,
    addCoupon,
    selectedCoupon,
    applyCoupon,
    deleteCoupon,
    totals,
  } = useStore();

  return (
    <div className='min-h-screen bg-gray-50'>
      <NotificationPanel notifications={notifications} addNotification={addNotification} />
      <Header
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        cart={cart}
      />
      <main className='max-w-7xl mx-auto px-4 py-8'>
        {isAdmin ? (
          <AdminPage
            products={products}
            coupons={coupons}
            addProduct={addProduct}
            updateProduct={updateProduct}
            deleteProduct={deleteProduct}
            addCoupon={addCoupon}
            deleteCoupon={deleteCoupon}
            addNotification={addNotification}
          />
        ) : (
          <CartPage
            products={products}
            cart={cart}
            coupons={coupons}
            totals={totals}
            searchTerm={searchTerm}
            selectedCoupon={selectedCoupon}
            applyCoupon={applyCoupon}
            addToCart={addToCart}
            removeFromCart={removeFromCart}
            updateQuantity={updateQuantity}
            getRemainingStock={getRemainingStock}
            clearCart={clearCart}
            addNotification={addNotification}
          />
        )}
      </main>
    </div>
  );
};

export default App;
