import { useAtom } from 'jotai';

import { isAdminAtom } from './atoms/uiAtoms';
import { AdminPage } from './components/AdminPage';
import { CartPage } from './components/CartList';
import { Header } from './components/Header';
import { ProductCardList } from './components/ProductCardList';
import { Toast } from './components/Toast';
import { useCart } from './hooks/useCart';
import { useCoupon } from './hooks/useCoupon';
import { useOrder } from './hooks/useOrder';

const App = () => {
  // UI atoms 사용
  const [isAdmin] = useAtom(isAdminAtom);

  const { updateQuantity, removeFromCart, calculateTotal, applyCoupon, cart, selectedCoupon } =
    useCart();

  const { coupons } = useCoupon();

  const { completeOrder } = useOrder();

  const totals = calculateTotal;

  return (
    <div className='min-h-screen bg-gray-50'>
      <Toast />

      <Header />
      <main className='max-w-7xl mx-auto px-4 py-8'>
        {isAdmin ? (
          <AdminPage />
        ) : (
          <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
            <ProductCardList />

            <CartPage
              cart={cart}
              selectedCoupon={selectedCoupon}
              coupons={coupons}
              totals={totals}
              removeFromCart={removeFromCart}
              updateQuantity={updateQuantity}
              applyCoupon={applyCoupon}
              completeOrder={completeOrder}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
