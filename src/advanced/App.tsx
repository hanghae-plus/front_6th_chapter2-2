import { useState, useEffect } from 'react';
import { CartItem } from '../types';
import { useNotification } from './hooks/useNotification';
import { useProducts } from './hooks/useProducts';
import { useCoupons } from './hooks/useCoupons';
import { useCart } from './hooks/useCart';
import { useSearchTerm } from './hooks/useSearchTerm';
import Header from './components/ui/layout/Header';
import Notification from './components/ui/notification/Notification';

import AdminPage from './components/AdminPage';
import ShopPage from './components/ShopPage';

const App = () => {
  const { notifications, addNotification, setNotifications } = useNotification();
  const { products, updateProduct, addProduct, deleteProduct } = useProducts();
  const { coupons, addCoupon, removeCoupon } = useCoupons();
  const {
    cart,
    selectedCoupon,
    setSelectedCoupon,
    addToCart,
    removeFromCart,
    updateQuantity,
    calculateCartTotal,
    getRemainingStock,
    clearCart,
  } = useCart(addNotification);

  const { searchTerm, handleSearchTerm, debouncedSearchTerm } = useSearchTerm();
  const [isAdmin, setIsAdmin] = useState(false);

  const getMaxApplicableDiscount = (item: CartItem): number => {
    const { discounts } = item.product;
    const { quantity } = item;

    const baseDiscount = discounts.reduce((maxDiscount, discount) => {
      return quantity >= discount.quantity && discount.rate > maxDiscount
        ? discount.rate
        : maxDiscount;
    }, 0);

    const hasBulkPurchase = cart.some((cartItem) => cartItem.quantity >= 10);
    if (hasBulkPurchase) {
      return Math.min(baseDiscount + 0.05, 0.5); // 대량 구매 시 추가 5% 할인
    }

    return baseDiscount;
  };

  const calculateItemTotal = (item: CartItem): number => {
    const { price } = item.product;
    const { quantity } = item;
    const discount = getMaxApplicableDiscount(item);

    return Math.round(price * quantity * (1 - discount));
  };

  const [totalItemCount, setTotalItemCount] = useState(0);

  useEffect(() => {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    setTotalItemCount(count);
  }, [cart]);

  return (
    <div className='min-h-screen bg-gray-50'>
      <Notification notifications={notifications} setNotifications={setNotifications} />
      <Header
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
        searchTerm={searchTerm}
        handleSearchTerm={handleSearchTerm}
        cartTotalItem={totalItemCount}
      />

      <main className='max-w-7xl mx-auto px-4 py-8'>
        {isAdmin ? (
          <AdminPage
            products={products}
            addProduct={addProduct}
            updateProduct={updateProduct}
            deleteProduct={deleteProduct}
            getRemainingStock={getRemainingStock}
            coupons={coupons}
            addCoupon={addCoupon}
            deleteCoupon={removeCoupon}
            selectedCoupon={selectedCoupon}
            setSelectedCoupon={setSelectedCoupon}
            addNotification={addNotification}
          />
        ) : (
          <ShopPage
            products={products}
            getRemainingStock={getRemainingStock}
            updateQuantity={updateQuantity}
            addToCart={addToCart}
            removeFromCart={removeFromCart}
            cart={cart}
            cartTotalPrice={calculateCartTotal()}
            calculateItemTotal={calculateItemTotal}
            clearCart={clearCart}
            coupons={coupons}
            selectedCoupon={selectedCoupon}
            setSelectedCoupon={setSelectedCoupon}
            debouncedSearchTerm={debouncedSearchTerm}
            addNotification={addNotification}
          />
        )}
      </main>
    </div>
  );
};

export default App;
