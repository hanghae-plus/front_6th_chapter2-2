import { useState } from 'react';
import { AdminPage } from './components/admin-page/AdminPage';
import { AdminPageHeader } from './components/admin-page/AdminPageHeader';
import { CartPage } from './components/cart-page/CartPage';
import { CartPageHeader } from './components/cart-page/CartPageHeader';
import { Notifications } from './components/Notifications';
import { useCart } from './hooks/useCart';
import { useCoupons } from './hooks/useCoupons';
import { useOrder } from './hooks/useOrder';
import { useProducts } from './hooks/useProducts';
import { useDebounce } from './utils/hooks/useDebounce';

const App = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { cart, totalItemCount, updateQuantity, clearCart } = useCart();
  const {
    coupons,
    selectedCoupon,
    addCoupon,
    deleteCoupon,
    applyCoupon,
    clearSelectedCoupon,
  } = useCoupons();
  const { completeOrder } = useOrder({
    clearCart,
    clearSelectedCoupon,
  });

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
          />
        ) : (
          <CartPage
            searchTerm={debouncedSearchTerm}
            products={products}
            cart={cart}
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
