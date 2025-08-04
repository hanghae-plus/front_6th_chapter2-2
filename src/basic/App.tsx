// src/basic/App.tsx
import { useState } from 'react';
import { useProducts } from './hooks/useProducts';
import { useCoupons } from './hooks/useCoupons';
import { useCart } from './hooks/useCart';
import { ProductList } from './components/ProductList';
import { Cart } from './components/Cart';
import { Admin } from './components/Admin';

type Page = 'shop' | 'admin';

function App() {
  const [page, setPage] = useState<Page>('shop');

  // 모든 상태와 로직을 커스텀 훅에서 가져옴
  const { products, addProduct, updateProduct, removeProduct } = useProducts();
  const { coupons, addCoupon, removeCoupon } = useCoupons();
  const { cart, addToCart, removeFromCart, updateQuantity, applyCoupon, selectedCoupon, cartTotal, clearCart } = useCart();

  const handleCheckout = () => {
    alert('결제가 완료되었습니다.');
    clearCart();
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <nav className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">쇼핑몰</h1>
        <div>
          <button onClick={() => setPage('shop')} className={`mr-4 ${page === 'shop' ? 'text-blue-500' : ''}`}>
            쇼핑 페이지
          </button>
          <button onClick={() => setPage('admin')} className={`${page === 'admin' ? 'text-blue-500' : ''}`}>
            관리자 페이지
          </button>
        </div>
      </nav>

      <main className="p-4">
        {page === 'shop' ? (
          <>
            <ProductList products={products} onAddToCart={addToCart} />
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
          </>
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
