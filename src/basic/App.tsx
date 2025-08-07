import { useState, useMemo } from 'react';
import { AdminDashboard, Header, NotificationItem, UserDashboard } from './ui';
import { useCoupons } from './entities/coupons';
import { useProducts } from './entities/products';
import { CartModel } from './models/cart';
import { ProductModel } from './models/product';
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

  const totals = useMemo(() => {
    const cartModel = new CartModel(cart);
    return cartModel.calculateTotal(selectedCoupon || undefined);
  }, [cart, selectedCoupon]);

  const filteredProducts = useMemo(() => {
    const productModel = new ProductModel(products);
    return productModel.filter(debouncedSearchTerm);
  }, [products, debouncedSearchTerm]);

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
            coupons={coupons}
            selectedCoupon={selectedCoupon}
            applyCoupon={(coupon) => applyCouponFromHook(coupon, cart)}
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
