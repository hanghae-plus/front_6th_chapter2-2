// src/basic/App.tsx
import { useState } from 'react';
import { useProducts } from './hooks/useProducts';
import { useCoupons } from './hooks/useCoupons';
import { useCart } from './hooks/useCart';
import { ProductList } from './components/ProductList';
import { Cart } from './components/Cart';
import { Admin } from './components/Admin';
import { useToast } from './utils/hooks/useToast';

type Page = 'shop' | 'admin';

function App() {
  const [page, setPage] = useState<Page>('shop');
  const { toastMessage, showToast } = useToast();
  const [orderCompleteMessage, setOrderCompleteMessage] = useState<
    string | null
  >(null);

  const {
    products,
    addProduct,
    updateProduct,
    removeProduct,
    setSearchKeyword,
  } = useProducts();
  const { coupons, addCoupon, removeCoupon } = useCoupons();
  const {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    selectedCoupon,
    cartTotal,
    clearCart,
    totalQuantity,
  } = useCart(showToast);

  const handleCheckout = () => {
    setOrderCompleteMessage('주문이 완료되었습니다.');
    clearCart();
    setTimeout(() => {
      setOrderCompleteMessage(null);
    }, 3000);
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      {toastMessage && (
        <div className='fixed top-20 right-4 z-50 space-y-2 max-w-sm'>
          <div className='p-4 rounded-md shadow-md text-white bg-green-600'>
            {toastMessage}
          </div>
        </div>
      )}
      {orderCompleteMessage && (
        <div className='fixed top-20 right-4 z-50 space-y-2 max-w-sm'>
          <div className='p-4 rounded-md shadow-md text-white bg-blue-600'>
            {orderCompleteMessage}
          </div>
        </div>
      )}
      <header className='bg-white shadow-sm sticky top-0 z-40 border-b'>
        <div className='max-w-7xl mx-auto px-4'>
          <div className='flex justify-between items-center h-16'>
            <div className='flex items-center flex-1 gap-4'>
              <h1 className='text-xl font-semibold text-gray-800'>SHOP</h1>
              <input
                type='text'
                placeholder='상품 검색...'
                onChange={e => setSearchKeyword(e.target.value)}
                className='w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500'
              />
            </div>
            <nav className='flex items-center space-x-4'>
              <button
                onClick={() => setPage(page === 'admin' ? 'shop' : 'admin')}
                className={`px-3 py-1.5 text-sm rounded transition-colors ${
                  page === 'admin'
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {page === 'admin' ? '쇼핑몰로 돌아가기' : '관리자 페이지로'}
              </button>
              {page === 'shop' && (
                <div className='relative'>
                  <svg
                    className='w-6 h-6 text-gray-700'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z'
                    />
                  </svg>
                  {cart.length > 0 && (
                    <span className='absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center'>
                      {totalQuantity}
                    </span>
                  )}
                </div>
              )}
            </nav>
          </div>
        </div>
      </header>

      <main className='max-w-7xl mx-auto px-4 py-8'>
        {page === 'shop' ? (
          <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
            <div className='lg:col-span-3'>
              <ProductList products={products} onAddToCart={addToCart} />
            </div>
            <div className='lg:col-span-1'>
              <div className='sticky top-24 space-y-4'>
                <Cart
                  cart={cart}
                  coupons={coupons}
                  selectedCoupon={selectedCoupon}
                  onUpdateQuantity={updateQuantity}
                  onRemoveFromCart={removeFromCart}
                  onApplyCoupon={applyCoupon}
                  cartTotal={cartTotal}
                  onCheckout={handleCheckout}
                />
              </div>
            </div>
          </div>
        ) : (
          <Admin
            products={products}
            coupons={coupons}
            onAddProduct={addProduct}
            onUpdateProduct={updateProduct}
            onRemoveProduct={removeProduct}
            onAddCoupon={addCoupon}
            onRemoveCoupon={removeCoupon}
          />
        )}
      </main>
    </div>
  );
}

export default App;
