import { useState, useEffect } from 'react';
import { Product } from './models/entities';

import Header from './components/ui/_layout/Header.tsx';
import { CartIcon } from './components/icons/CartIcon.tsx';
import ToastContainer from './components/ui/Toast/ToastContainer.tsx';
import { useProducts } from './hooks/useProducts.ts';
import { useNotifications } from './hooks/useNotifications.ts';
import { useCart } from './hooks/useCart.ts';
import AdminView from './components/view/AdminView.tsx';
import CartView from './components/view/CartView.tsx';
import { useCoupons } from './hooks/useCoupons.ts';
import { SearchBar } from './components/ui/SearchBar.tsx';
import Button from './components/ui/Button.tsx';

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

  const [isAdmin, setIsAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [totalItemCount, setTotalItemCount] = useState(0);

  useEffect(() => {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    setTotalItemCount(count);
  }, [cart]);

  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cart));
    } else {
      localStorage.removeItem('cart');
    }
  }, [cart]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

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
      <Header>
        <Header.Left>
          <h1 className="text-xl font-semibold text-gray-800">SHOP</h1>
          {/* 검색창 - 안티패턴: 검색 로직이 컴포넌트에 직접 포함 */}
          {!isAdmin && (
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              className={'ml-8 flex-1 max-w-md'}
            />
          )}
        </Header.Left>
        <Header.Right>
          <Button
            onClick={() => setIsAdmin(!isAdmin)}
            className={`px-3 py-1.5 text-sm rounded transition-colors ${
              isAdmin
                ? 'bg-gray-800 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {isAdmin ? '쇼핑몰로 돌아가기' : '관리자 페이지로'}
          </Button>
          {!isAdmin && (
            <div className="relative">
              <CartIcon />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItemCount}
                </span>
              )}
            </div>
          )}
        </Header.Right>
      </Header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? (
          <AdminView
            cart={cart}
            products={products}
            coupons={coupons}
            addNotification={addNotification}
            updateProduct={updateProduct}
            deleteProduct={deleteProduct}
            addProduct={addProduct}
            deleteCoupon={deleteCoupon}
            addCoupon={addCoupon}
          />
        ) : (
          <CartView
            addNotification={addNotification}
            debouncedSearchTerm={debouncedSearchTerm}
            cart={cart}
            coupons={coupons}
            addToCart={addToCart}
            onRemoveFromCart={removeFromCart}
            onUpdateQuantity={updateQuantity}
            onApplyCoupon={applyCoupon}
            onResetCart={onResetCart}
            selectedCoupon={selectedCoupon}
            onResetCoupon={resetCoupon}
          />
        )}
      </main>
    </div>
  );
};

export default App;
