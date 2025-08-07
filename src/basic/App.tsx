import { calculateCartTotal } from './utils/calculators';
import { ProductWithUI } from './types';
import { useNotifications } from './hooks/useNotifications';
import { useCoupon } from './hooks/useCoupon';
import { useProducts } from './hooks/useProducts';
import { useCart } from './hooks/useCart';
import { useSearch } from './hooks/useSearch';
import { useUIState } from './hooks/useUIStates';
import { useCouponForm } from './hooks/useCouponForm';
import { Notification } from './components/ui';
import { Header } from './components/layout';
import { AdminPage, ShoppingPage } from './components/pages';

// 초기 데이터
const initialProducts: ProductWithUI[] = [
  {
    id: 'p1',
    name: '상품1',
    price: 10000,
    stock: 20,
    discounts: [
      { quantity: 10, rate: 0.1 },
      { quantity: 20, rate: 0.2 },
    ],
    description: '최고급 품질의 프리미엄 상품입니다.',
  },
  {
    id: 'p2',
    name: '상품2',
    price: 20000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.15 }],
    description: '다양한 기능을 갖춘 실용적인 상품입니다.',
    isRecommended: true,
  },
  {
    id: 'p3',
    name: '상품3',
    price: 30000,
    stock: 20,
    discounts: [
      { quantity: 10, rate: 0.2 },
      { quantity: 30, rate: 0.25 },
    ],
    description: '대용량과 고성능을 자랑하는 상품입니다.',
  },
];

const App = () => {
  const { notifications, addNotification, removeNotification } =
    useNotifications();

  const { searchTerm, setSearchTerm, debouncedSearchTerm } = useSearch();

  const {
    coupons,
    selectedCoupon,
    onAddCoupon,
    onRemoveCoupon,
    onClearSelectedCoupon,
    onApplyCoupon,
  } = useCoupon({ cart: [], calculateCartTotal, addNotification });

  const {
    products,
    editingProduct,
    productForm,
    showProductForm,
    filteredProducts,
    onAddProduct,
    onUpdateProduct,
    onDeleteProduct,
    onStartEditProduct,
    setProductForm,
    setEditingProduct,
    setShowProductForm,
  } = useProducts({
    addNotification,
    initialProducts,
    searchTerm: debouncedSearchTerm,
  });

  const {
    cart,
    onAddToCart,
    onUpdateQuantity,
    onCompleteOrder,
    onRemoveFromCart,
    totalItemCount,
    totals,
  } = useCart({
    products,
    selectedCoupon,
    addNotification,
  });

  const {
    isAdmin,
    activeTab,
    showCouponForm,
    onSetActiveTab,
    setShowCouponForm,
    onToggleAdmin,
  } = useUIState();

  const { couponForm, setCouponForm } = useCouponForm();

  return (
    <div className='min-h-screen bg-gray-50'>
      {notifications.length > 0 && (
        <div className='fixed top-20 right-4 z-50 space-y-2 max-w-sm'>
          {notifications.map(notif => (
            <Notification
              key={notif.id}
              message={notif.message}
              type={notif.type}
              onClose={() => removeNotification(notif.id)}
            />
          ))}
        </div>
      )}
      <Header
        isAdmin={isAdmin}
        searchTerm={searchTerm}
        cartLength={cart.length}
        totalItemCount={totalItemCount}
        onSearchChange={setSearchTerm}
        onToggleAdmin={onToggleAdmin}
      />

      <main className='max-w-7xl mx-auto px-4 py-8'>
        {isAdmin ? (
          <AdminPage
            activeTab={activeTab}
            products={products}
            productForm={productForm}
            editingProduct={editingProduct}
            showProductForm={showProductForm}
            cart={cart}
            isAdmin={isAdmin}
            coupons={coupons}
            couponForm={couponForm}
            showCouponForm={showCouponForm}
            onSetActiveTab={onSetActiveTab}
            onAddProduct={onAddProduct}
            onUpdateProduct={onUpdateProduct}
            onDeleteProduct={onDeleteProduct}
            onStartEditProduct={onStartEditProduct}
            setProductForm={setProductForm}
            setEditingProduct={setEditingProduct}
            setShowProductForm={setShowProductForm}
            onRemoveCoupon={onRemoveCoupon}
            onAddCoupon={onAddCoupon}
            setCouponForm={setCouponForm}
            setShowCouponForm={setShowCouponForm}
            addNotification={addNotification}
          />
        ) : (
          <ShoppingPage
            products={products}
            filteredProducts={filteredProducts}
            cart={cart}
            coupons={coupons}
            selectedCoupon={selectedCoupon}
            totals={totals}
            searchTerm={debouncedSearchTerm}
            isAdmin={isAdmin}
            onAddToCart={onAddToCart}
            onUpdateQuantity={onUpdateQuantity}
            onRemoveFromCart={onRemoveFromCart}
            onApplyCoupon={onApplyCoupon}
            onClearSelectedCoupon={onClearSelectedCoupon}
            onCompleteOrder={onCompleteOrder}
          />
        )}
      </main>
    </div>
  );
};

export default App;
