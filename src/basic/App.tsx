import { useState, useCallback } from 'react';
import { Coupon } from '../types';
import { ProductWithUI } from './constants/mocks';
import { AdminDashboard, Header, NotificationItem, UserDashboard } from './ui';
import { useCoupons } from './entities/coupons';
import { useProducts } from './entities/products';
import {
  formatPriceWithStock,
  calculateItemTotal,
  calculateCartTotal,
  filterProducts,
  validateCouponApplication,
} from './utils';
import { useCart, useDebounceValue, useNotifications, useTotalItemCount } from './hooks';
import { INITIAL_PRODUCT_FORM, INITIAL_COUPON_FORM, EDITING_STATES } from './constants/forms';

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const { notifications, addNotification, removeNotification } = useNotifications();
  const {
    products,
    productForm,
    editingProduct,
    showProductForm,
    setShowProductForm,
    setEditingProduct,
    setProductForm,
    addProduct,
    updateProduct,
    deleteProduct,
  } = useProducts({ addNotification });
  const {
    coupons,
    selectedCoupon,
    setSelectedCoupon,
    showCouponForm,
    setShowCouponForm,
    couponForm,
    setCouponForm,
    addCoupon,
    deleteCoupon,
  } = useCoupons({ addNotification });
  const { cart, addToCart, removeFromCart, updateQuantity, completeOrder, getStock } = useCart({
    products,
    addNotification,
    setSelectedCoupon,
  });
  const totalItemCount = useTotalItemCount(cart);
  const [searchTerm, setSearchTerm] = useState('');

  const debouncedSearchTerm = useDebounceValue(searchTerm, 500);

  const formatPrice = useCallback(
    (price: number, productId?: string): string => {
      if (productId) {
        return formatPriceWithStock(price, productId, products, cart, isAdmin);
      }

      if (isAdmin) {
        return `${price.toLocaleString()}원`;
      }

      return `₩${price.toLocaleString()}`;
    },
    [products, cart, isAdmin]
  );

  const applyCoupon = useCallback(
    (coupon: Coupon) => {
      const currentTotal = calculateCartTotal(cart, selectedCoupon).totalAfterDiscount;
      const validation = validateCouponApplication(coupon, currentTotal);

      if (!validation.isValid) {
        addNotification(validation.errorMessage!, 'error');
        return;
      }

      setSelectedCoupon(coupon);
      addNotification('쿠폰이 적용되었습니다.', 'success');
    },
    [addNotification, cart, selectedCoupon]
  );

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct && editingProduct !== EDITING_STATES.NEW) {
      updateProduct(editingProduct, productForm);
      setEditingProduct(null);
    } else {
      addProduct({
        ...productForm,
        discounts: productForm.discounts,
      });
    }
    setProductForm(INITIAL_PRODUCT_FORM);
    setEditingProduct(null);
    setShowProductForm(false);
  };

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCoupon(couponForm);
    setCouponForm(INITIAL_COUPON_FORM);
    setShowCouponForm(false);
  };

  const startEditProduct = (product: ProductWithUI) => {
    setEditingProduct(product.id);
    setProductForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
      description: product.description || '',
      discounts: product.discounts || [],
    });
    setShowProductForm(true);
  };

  const totals = calculateCartTotal(cart, selectedCoupon);

  const filteredProducts = filterProducts(products, debouncedSearchTerm);

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
            formatPrice={formatPrice}
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
            formatPrice={formatPrice}
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
