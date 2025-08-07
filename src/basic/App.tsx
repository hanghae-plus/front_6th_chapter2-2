import { useState } from 'react';
import AdminPage from './components/AdminPage.tsx';
import CartPage from './components/CartPage.tsx';
import Toast from './components/ui/toast/Toast.tsx';
import { useCart } from './hooks/useCart.ts';
import { useCoupons } from './hooks/useCoupons.ts';
import { useProducts } from './hooks/useProducts.ts';
import { useNotifications } from './hooks/useNotifications.ts';

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  const {
    cart,
    selectedCoupon,
    clearSelectedCoupon,
    clearCart,
    applyCoupon,
    addToCart,
    removeFromCart,
    updateQuantity,
  } = useCart();
  const { coupons, addCoupon, deleteCoupon } = useCoupons({
    onCouponDeleted: clearSelectedCoupon,
  });
  const { products, deleteProduct, updateProduct, addProduct } = useProducts();
  const { notifications, addNotification, showNotifyFromResult, hideNotification } =
    useNotifications();

  return (
    <div className="min-h-screen bg-gray-50">
      <Toast notifications={notifications} onHideNotification={hideNotification} />

      {isAdmin ? (
        <AdminPage
          products={products}
          coupons={coupons}
          cart={cart}
          isAdmin={isAdmin}
          onAddProduct={addProduct}
          onUpdateProduct={updateProduct}
          onDeleteProduct={deleteProduct}
          onAddCoupon={addCoupon}
          onDeleteCoupon={deleteCoupon}
          onAdminModeChange={setIsAdmin}
          onAddNotification={addNotification}
          onShowNotification={showNotifyFromResult}
        />
      ) : (
        <CartPage
          products={products}
          cart={cart}
          coupons={coupons}
          selectedCoupon={selectedCoupon}
          onApplyCoupon={applyCoupon}
          onSelectedCoupon={applyCoupon}
          isAdmin={isAdmin}
          onAddToCart={addToCart}
          onRemoveFromCart={removeFromCart}
          onClearCart={clearCart}
          onUpdateQuantity={updateQuantity}
          onAdminModeChange={setIsAdmin}
          onAddNotification={addNotification}
          onShowNotification={showNotifyFromResult}
        />
      )}
    </div>
  );
};

export default App;
