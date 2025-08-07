import { useState, useCallback, useMemo } from 'react';
import { Coupon } from '@/types';
import { AdminDashboard, Header, NotificationItem, UserDashboard } from './ui';
import { useCoupons } from './entities/coupons';
import { useProducts } from './entities/products';
import { calculateItemTotal, calculateCartTotal, filterProducts } from './utils';
import { useCart, useDebounceValue, useNotifications, useTotalItemCount } from './hooks';

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const { notifications, addNotification, removeNotification } = useNotifications();
  const {
    products,
    productForm,
    showProductForm,
    setShowProductForm,
    setProductForm,
    deleteProduct,
    startEditProduct,
    handleProductSubmit,
  } = useProducts({ addNotification });
  const {
    coupons,
    selectedCoupon,
    couponForm,
    showCouponForm,
    setSelectedCoupon,
    setShowCouponForm,
    setCouponForm,
    deleteCoupon,
    handleCouponSubmit,
    applyCoupon: applyCouponFromHook,
  } = useCoupons({ addNotification });
  const { cart, addToCart, removeFromCart, updateQuantity, completeOrder, getStock } = useCart({
    products,
    addNotification,
    setSelectedCoupon,
  });
  const totalItemCount = useTotalItemCount(cart);
  const [searchTerm, setSearchTerm] = useState('');

  const debouncedSearchTerm = useDebounceValue(searchTerm, 500);

  const applyCoupon = useCallback(
    (coupon: Coupon) => applyCouponFromHook(coupon, cart),
    [applyCouponFromHook, cart]
  );

  const totals = useMemo(() => calculateCartTotal(cart, selectedCoupon), [cart, selectedCoupon]);

  const filteredProducts = useMemo(
    () => filterProducts(products, debouncedSearchTerm),
    [products, debouncedSearchTerm]
  );

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Notification */}
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
        cart={cart}
        totalItemCount={totalItemCount}
      />
      <main className='max-w-7xl mx-auto px-4 py-8'>
        {isAdmin ? (
          // Admin Dashboard
          <AdminDashboard
            products={products}
            coupons={coupons}
            isAdmin={isAdmin}
            productForm={productForm}
            showProductForm={showProductForm}
            couponForm={couponForm}
            showCouponForm={showCouponForm}
            setProductForm={setProductForm}
            setShowProductForm={setShowProductForm}
            setCouponForm={setCouponForm}
            setShowCouponForm={setShowCouponForm}
            addNotification={addNotification}
            startEditProduct={startEditProduct}
            deleteProduct={deleteProduct}
            handleProductSubmit={handleProductSubmit}
            deleteCoupon={deleteCoupon}
            handleCouponSubmit={handleCouponSubmit}
          />
        ) : (
          <UserDashboard
            products={products}
            filteredProducts={filteredProducts}
            debouncedSearchTerm={debouncedSearchTerm}
            isAdmin={isAdmin}
            cart={cart}
            addToCart={addToCart}
            removeFromCart={removeFromCart}
            updateQuantity={updateQuantity}
            getStock={getStock}
            calculateItemTotal={(item) => calculateItemTotal(item, cart)}
            coupons={coupons}
            selectedCoupon={selectedCoupon}
            applyCoupon={applyCoupon}
            setSelectedCoupon={setSelectedCoupon}
            totals={totals}
            completeOrder={completeOrder}
          />
        )}
      </main>
    </div>
  );
};

export default App;
