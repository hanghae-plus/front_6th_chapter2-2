import { useEffect, useState } from 'react';
import { CartSection } from './components/cart-section';
import { CouponSection } from './components/coupon-section';
import { Header } from './components/header';
import { Notifications } from './components/notifications';
import { PaymentInfoSection } from './components/payment-info-section';
import { ProductSection } from './components/product-section';
import { useShoppingPageViewModel } from './view-model';

const ShoppingPage = () => {
  const {
    cartTotals,
    applyCoupon,
    selectedCoupon,
    completeOrder,
    notifications,
    resetSelectedCoupon,
    productStore,
    cartStore,
    couponStore,
    updateQuantity,
    removeNotification,
    addToCart,
    removeFromCart,
    formatPrice,
    filterProducts,
  } = useShoppingPageViewModel();

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const filteredProducts = filterProducts(debouncedSearchTerm);

  return (
    <div className="min-h-screen bg-gray-50">
      <Notifications
        notifications={notifications}
        removeNotification={removeNotification}
      />
      <Header
        searchTerm={debouncedSearchTerm}
        handleSearchTem={value => setSearchTerm(value)}
      />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <ProductSection
              products={productStore.products}
              filteredProducts={filteredProducts}
              debouncedSearchTerm={debouncedSearchTerm}
              formatPrice={formatPrice}
              cart={cartStore.cart}
              addToCart={addToCart}
            />
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <CartSection
                cart={cartStore.cart}
                updateQuantity={updateQuantity}
                removeFromCart={removeFromCart}
              />

              {cartStore.cart.length > 0 && (
                <>
                  <CouponSection
                    coupons={couponStore.coupons}
                    selectedCoupon={selectedCoupon}
                    applyCoupon={applyCoupon}
                    resetSelectedCoupon={resetSelectedCoupon}
                  />

                  <PaymentInfoSection
                    totalAfterDiscount={cartTotals.totalAfterDiscount}
                    totalBeforeDiscount={cartTotals.totalBeforeDiscount}
                    completeOrder={completeOrder}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ShoppingPage;
