import { useState, useEffect } from 'react';
import { useCart } from './hooks/useCart';
import { useCoupons } from './hooks/useCoupons';
import { useProducts } from './hooks/useProducts';
import { useNotification } from './hooks/useNotification';
import { useProductSearch } from './hooks/useProductSearch';
import { SEARCH_DELAY } from './shared/constants/toast';
import { CloseIcon } from './components/icons';
import Header from './components/ui/Header';
import { AdminPage } from './pages/AdminPage';
import { CartPage } from './pages/CartPage';

const App = () => {
  const {
    cart,
    selectedCoupon,
    selectCoupon,
    addToCart: addToCartHook,
    removeFromCart,
    updateQuantity: updateQuantityHook,
    applyCoupon: applyCouponHook,
    calculateTotal,
    getRemainingStock,
    clearCart,
  } = useCart();

  const {
    products,
    addProduct: addProductHook,
    updateProduct: updateProductHook,
    deleteProduct: deleteProductHook,
  } = useProducts();

  const { coupons, addCoupon: addCouponHook, deleteCoupon: deleteCouponHook } = useCoupons();

  const { notifications, addNotification, removeNotification } = useNotification();

  const { searchTerm, handleSearchTermChange, filteredProducts } = useProductSearch(products, SEARCH_DELAY);

  const [isAdmin, setIsAdmin] = useState(false);
  const [totalItemCount, setTotalItemCount] = useState(0);

  // 장바구니 상품 개수 계산
  useEffect(() => {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    setTotalItemCount(count);
  }, [cart]);

  // 로컬 스토리지 동기화
  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('coupons', JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cart));
    } else {
      localStorage.removeItem('cart');
    }
  }, [cart]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 전역 알림 */}
      {notifications.length > 0 && (
        <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 rounded-md shadow-md text-white flex justify-between items-center ${
                notif.type === 'error' ? 'bg-red-600' : notif.type === 'warning' ? 'bg-yellow-600' : 'bg-green-600'
              }`}
            >
              <span className="mr-2">{notif.message}</span>
              <button onClick={() => removeNotification(notif.id)} className="text-white hover:text-gray-200">
                <CloseIcon />
              </button>
            </div>
          ))}
        </div>
      )}

      <Header
        isAdmin={isAdmin}
        searchTerm={searchTerm}
        handleSearchTermChange={handleSearchTermChange}
        cart={cart}
        totalItemCount={totalItemCount}
        setIsAdmin={setIsAdmin}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? (
          <AdminPage
            products={products}
            coupons={coupons}
            addProduct={addProductHook}
            updateProduct={updateProductHook}
            deleteProduct={deleteProductHook}
            addCoupon={addCouponHook}
            deleteCoupon={deleteCouponHook}
            addNotification={addNotification}
            selectedCoupon={selectedCoupon}
            selectCoupon={selectCoupon}
          />
        ) : (
          <CartPage
            products={products}
            filteredProducts={filteredProducts}
            searchTerm={searchTerm}
            cart={cart}
            coupons={coupons}
            selectedCoupon={selectedCoupon}
            selectCoupon={selectCoupon}
            addToCart={addToCartHook}
            removeFromCart={removeFromCart}
            updateQuantity={updateQuantityHook}
            applyCoupon={applyCouponHook}
            calculateTotal={calculateTotal}
            getRemainingStock={getRemainingStock}
            clearCart={clearCart}
            addNotification={addNotification}
          />
        )}
      </main>
    </div>
  );
};

export default App;
