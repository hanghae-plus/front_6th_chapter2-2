import { useState, useEffect } from 'react';
import { Product } from './models/entities';

import ToastContainer from './components/ui/Toast/ToastContainer.tsx';
import { useProducts } from './hooks/useProducts.ts';
import { useNotifications } from './hooks/useNotifications.ts';
import { useCart } from './hooks/useCart.ts';

import { useCoupons } from './hooks/useCoupons.ts';
import { useAppState } from './hooks/useAppState.ts';
import { useSearch } from './hooks/useSearch.ts';
import AppHeader from './components/layout/AppHeader.tsx';
import AppMain from './components/layout/AppMain.tsx';

export interface ProductWithUI extends Product {
  description?: string;
  isRecommended?: boolean;
}

const App = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { addNotification, notifications, handleCloseToast } =
    useNotifications();
  const { updateQuantity, removeFromCart, addToCart, cart, setCart } = useCart(
    products,
    addNotification
  );
  const {
    coupons,
    applyCoupon,
    selectedCoupon,
    resetCoupon,
    addCoupon,
    deleteCoupon,
  } = useCoupons(cart);

  const { isAdmin, toggleAdminMode } = useAppState();
  const { searchTerm, debouncedSearchTerm, setSearchTerm } = useSearch();
  const [totalItemCount, setTotalItemCount] = useState(0);

  useEffect(() => {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    setTotalItemCount(count);
  }, [cart]);

  const onResetCart = () => {
    setCart([]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {notifications.length > 0 && (
        <ToastContainer
          notifications={notifications}
          onClose={handleCloseToast}
        />
      )}
      <AppHeader
        isAdmin={isAdmin}
        searchTerm={searchTerm}
        totalItemCount={totalItemCount}
        cartLength={cart.length}
        toggleAdminMode={toggleAdminMode}
        setSearchTerm={setSearchTerm}
      />

      <AppMain
        isAdmin={isAdmin}
        products={products}
        cart={cart}
        coupons={coupons}
        selectedCoupon={selectedCoupon}
        productActions={{
          addProduct,
          updateProduct,
          deleteProduct,
        }}
        cartActions={{
          addToCart,
          removeFromCart,
          updateQuantity,
          onResetCart,
        }}
        couponActions={{
          addCoupon,
          deleteCoupon,
          applyCoupon,
          resetCoupon,
        }}
        searchState={{
          debouncedSearchTerm,
        }}
        commonActions={{
          addNotification,
        }}
      />
    </div>
  );
};

export default App;
