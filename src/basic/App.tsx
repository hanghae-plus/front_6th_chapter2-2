import { useState, useCallback, useEffect } from 'react';
import { CartItem, Product } from '../types';
import { useNotification } from './hooks/useNotification';
import { useProducts } from './hooks/useProducts';
import { useCoupons } from './hooks/useCoupons';
import { useCart } from './hooks/useCart';
import { useSearchTerm } from './hooks/useSearchTerm';
import Header from './components/ui/layout/Header';
import Notification from './components/ui/notification/Notification';
import ProductList from './components/ui/product/ProductList';

import { PlusIcon } from './components/icons';
import { TabLayout } from './components/ui/layout/TabLayout';
import CouponGrid from './components/ui/coupon/CouponCard';
import CouponForm from './components/ui/coupon/CouponForm';
import CouponSelector from './components/ui/coupon/CouponSelector';
import ProductTab from './components/ui/product/ProductTab';
import CartList from './components/ui/cart/CartList';
import OrderSummary from './components/ui/cart/OrderSummary';
import AdminPage from './components/AdminPage';

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
    applyCoupon,
    calculateCartTotal,
    getRemainingStock,
    clearCart,
  } = useCart(addNotification);

  const { searchTerm, handleSearchTerm, debouncedSearchTerm } = useSearchTerm();
  const [isAdmin, setIsAdmin] = useState(false);
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'products' | 'coupons'>('products');

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

  const completeOrder = useCallback(() => {
    const orderNumber = `ORD-${Date.now()}`;
    addNotification(`주문이 완료되었습니다. 주문번호: ${orderNumber}`, 'success');
    clearCart();
  }, [addNotification]);

  const handleActiveTab = (value: 'products' | 'coupons') => {
    setActiveTab(value);
  };

  const totals = calculateCartTotal();

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
          <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
            <div className='lg:col-span-3'>
              {/* 상품 목록 */}
              <ProductList
                products={products as Product[]}
                getRemainingStock={getRemainingStock}
                addToCart={addToCart}
                debouncedSearchTerm={debouncedSearchTerm}
              />
            </div>

            <div className='lg:col-span-1'>
              <div className='sticky top-24 space-y-4'>
                <CartList
                  cart={cart}
                  calculateItemTotal={calculateItemTotal}
                  removeItemFromCart={removeFromCart}
                  updateItemQuantity={updateQuantity}
                />

                {cart.length > 0 && (
                  <>
                    <CouponSelector
                      coupons={coupons}
                      selectedCoupon={selectedCoupon}
                      setSelectedCoupon={setSelectedCoupon}
                      applyCoupon={applyCoupon}
                    />

                    <OrderSummary cartTotalPrice={totals} completeOrder={completeOrder} />
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
