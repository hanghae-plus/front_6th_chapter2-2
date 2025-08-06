import { useState } from 'react';
import Toast from './components/ui/Toast';
import Header from './components/ui/Header';
import { useProducts } from './hooks/product/useProducts';
import { useProductForm } from './hooks/product/useProductForm';
import { useCoupons } from './hooks/coupons/useCoupons';
import { calculateCartTotal } from './utils/calculations/cartCalculations';
import { useCouponsForm } from './hooks/coupons/useCouponsForm';
import { useCart } from './hooks/cart/useCart';
import useCheckout from './hooks/checkout/useCheckout';
import { filteredProducts } from './utils/calculations/productCalculations';
import { useSearch } from './hooks/search/useSearch';
import AdminDashboard from './components/admin/AdminDashboard';
import ShopView from './components/user/ShopView';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { addNotificationAtom, notificationsAtom } from './atoms/notificationsAtoms';
import { isAdminAtom } from './atoms/uiAtoms';

const App = () => {
  // 기본 데이터 관리
  const [notifications] = useAtom(notificationsAtom);
  const addNotification = useSetAtom(addNotificationAtom);

  // UI 상태 관리
  const isAdmin = useAtomValue(isAdminAtom);

  // 쿠폰 관리 훅
  const { coupons, setCoupons, selectedCoupon, setSelectedCoupon, applyCoupon } = useCoupons(
    (message) => addNotification({ message, type: 'success' }),
    (message) => addNotification({ message, type: 'error' }),
  );

  // 쿠폰 폼 관리 훅
  const { couponForm, setCouponForm, deleteCoupon, handleCouponSubmit } = useCouponsForm(
    coupons,
    setCoupons,
    selectedCoupon,
    setSelectedCoupon,
    (message) => addNotification({ message, type: 'success' }),
    (message) => addNotification({ message, type: 'error' }),
    (message) => addNotification({ message, type: 'success' }),
  );

  // 장바구니 관리 훅
  const { cart, setCart, totalCartItem, addToCart, removeFromCart, updateQuantity } = useCart();

  // 검색 기능 훅
  const { query, setQuery, debouncedQuery } = useSearch();

  // 결제 처리 훅
  const { completeOrder } = useCheckout(
    () => setCart([]),
    () => setSelectedCoupon(null),
    (message) => addNotification({ message, type: 'success' }),
  );

  // 계산된 데이터
  const totals = calculateCartTotal(cart, selectedCoupon);
  // const filteredProductList = filteredProducts(products, debouncedQuery);

  return (
    <div className='min-h-screen bg-gray-50'>
      {notifications.length > 0 && (
        <div className='fixed top-20 right-4 z-50 space-y-2 max-w-sm'>
          {notifications.map((notification) => {
            return (
              <Toast
                key={notification.id}
                id={notification.id}
                type={notification.type}
                message={notification.message}
              />
            );
          })}
        </div>
      )}
      <Header query={query} setQuery={setQuery} cart={cart} totalCartItem={totalCartItem} />

      <main className='max-w-7xl mx-auto px-4 py-8'>
        {isAdmin ? (
          <AdminDashboard
            cart={cart}
            coupons={coupons}
            couponForm={couponForm}
            onCouponDelete={deleteCoupon}
            onCouponSubmit={handleCouponSubmit}
            onCouponFormChange={setCouponForm}
          />
        ) : (
          <ShopView
            filteredProductList={filteredProductList}
            debouncedQuery={debouncedQuery}
            cart={cart}
            coupons={coupons}
            selectedCoupon={selectedCoupon}
            totals={totals}
            addToCart={addToCart}
            onRemoveFromCart={removeFromCart}
            onUpdateQuantity={updateQuantity}
            onApplyCoupon={applyCoupon}
            onSelectedCouponChange={setSelectedCoupon}
            onCompleteOrder={completeOrder}
          />
        )}
      </main>
    </div>
  );
};

export default App;
