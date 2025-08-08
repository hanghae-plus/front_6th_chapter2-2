import { useState } from 'react';
import { AdminPage } from './components/admin-page/AdminPage';
import { AdminPageHeader } from './components/admin-page/AdminPageHeader';
import { CartPage } from './components/cart-page/CartPage';
import { CartPageHeader } from './components/cart-page/CartPageHeader';
import { Notifications } from './components/Notifications';
import { useCart } from './hooks/useCart';
import { useCoupons } from './hooks/useCoupons';
import { useNotification } from './hooks/useNotification';
import { useOrder } from './hooks/useOrder';
import { useProducts } from './hooks/useProducts';
import { useDebounce } from './utils/hooks/useDebounce';

const App = () => {
  const { notifications, notify, removeNotification } = useNotification();
  const { products, addProduct, updateProduct, deleteProduct } = useProducts({
    notify,
  });
  const {
    cart,
    totalItemCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  } = useCart({
    notify,
  });
  const {
    coupons,
    selectedCoupon,
    addCoupon,
    deleteCoupon,
    applyCoupon,
    clearSelectedCoupon,
  } = useCoupons({ notify });
  const { completeOrder } = useOrder({
    notify,
    clearCart,
    clearSelectedCoupon,
  });

  const [isAdmin, setIsAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce({ delay: 500, value: searchTerm });

  return (
    <div className="min-h-screen bg-gray-50">
      <Notifications
        notifications={notifications}
        removeNotification={removeNotification}
      />

      {isAdmin ? (
        <AdminPageHeader setIsAdmin={setIsAdmin} />
      ) : (
        <CartPageHeader
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          setIsAdmin={setIsAdmin}
          totalItemCount={totalItemCount}
        />
      )}

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? (
          <AdminPage
            cart={cart}
            products={products}
            addProduct={addProduct}
            deleteProduct={deleteProduct}
            updateProduct={updateProduct}
            coupons={coupons}
            addCoupon={addCoupon}
            deleteCoupon={deleteCoupon}
            notify={notify}
          />
        ) : (
          <CartPage
            searchTerm={debouncedSearchTerm}
            products={products}
            cart={cart}
            addToCart={addToCart}
            removeFromCart={removeFromCart}
            updateQuantity={updateQuantity}
            coupons={coupons}
            selectedCoupon={selectedCoupon}
            applyCoupon={applyCoupon}
            clearSelectedCoupon={clearSelectedCoupon}
            completeOrder={completeOrder}
          />
        )}
      </main>
    </div>
  );
};

export default App;
