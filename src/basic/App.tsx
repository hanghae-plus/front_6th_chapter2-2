import { useState, useEffect } from 'react';

import { AdminPage } from './components/AdminPage';
import { CartPage } from './components/CartPage';
import { Header } from './components/Header';
import { NotificationPanel } from './components/NotificationPanel';
import { useCart } from './hooks/useCart';
import { useCoupons } from './hooks/useCoupons';
import { useNotifications } from './hooks/useNotifications';
import { useProducts } from './hooks/useProducts';

import * as cartModel from './models/cart';

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  const { notifications, setNotifications, addNotification } = useNotifications();

  const { products, addProduct, updateProduct, deleteProduct } = useProducts({ addNotification });

  const { cart, addToCart, removeFromCart, updateQuantity, getRemainingStock, clearCart } = useCart(
    { products, addNotification },
  );
  const { coupons, addCoupon, selectedCoupon, applyCoupon, deleteCoupon } = useCoupons({
    addNotification,
  });

  const totals = cartModel.calculateCartTotal(cart, selectedCoupon);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  return (
    <div className='min-h-screen bg-gray-50'>
      <NotificationPanel notifications={notifications} setNotifications={setNotifications} />
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
            debouncedSearchTerm={debouncedSearchTerm}
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
