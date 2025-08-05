import { useState } from 'react';
import Toast from './components/ui/Toast';
import Header from './components/ui/Header';
import { useProducts } from './hooks/product/useProducts';
import { useNotifications } from './hooks/notifications/useNotifications';
import { useProductForm } from './hooks/product/useProductForm';
import { getRemainingStock } from './utils/calculations/stockCalculations';
import { useCoupons } from './hooks/coupons/useCoupons';
import { calculateCartTotal } from './utils/calculations/cartCalculations';
import { useCouponsForm } from './hooks/coupons/useCouponsForm';
import { useCart } from './hooks/cart/useCart';
import useCheckout from './hooks/checkout/useCheckout';
import { filteredProducts } from './utils/calculations/productCalculations';
import { useSearch } from './hooks/search/useSearch';
import AdminDashboard from './components/admin/AdminDashboard';
import ProductCard from './components/ui/ProductCard';
import Cart from './components/user/Cart';

const App = () => {
  // 기본 데이터 관리
  const { products, deleteProduct, updateProduct, addProduct } = useProducts();
  const { notifications, setNotifications, addNotification } = useNotifications();

  // UI 상태 관리
  const [isAdmin, setIsAdmin] = useState(false);

  // 상품 폼 관리 훅 (추가/수정)
  const {
    productForm,
    setProductForm,
    editingProduct,
    setEditingProduct,
    handleProductSubmit,
    handleProductEdit,
  } = useProductForm(addProduct, updateProduct);

  // 쿠폰 관리 훅
  const { coupons, setCoupons, selectedCoupon, setSelectedCoupon, applyCoupon } = useCoupons(
    (message) => addNotification(message, 'success'),
    (message) => addNotification(message, 'error'),
  );

  // 쿠폰 폼 관리 훅
  const { couponForm, setCouponForm, deleteCoupon, handleCouponSubmit } = useCouponsForm(
    coupons,
    setCoupons,
    selectedCoupon,
    setSelectedCoupon,
    (message) => addNotification(message, 'success'),
    (message) => addNotification(message, 'error'),
    (message) => addNotification(message, 'success'),
  );

  // 장바구니 관리 훅
  const { cart, setCart, totalCartItem, addToCart, removeFromCart, updateQuantity } = useCart(
    products,
    (message) => addNotification(message, 'success'),
    (message) => addNotification(message, 'error'),
  );

  // 검색 기능 훅
  const { query, setQuery, debouncedQuery } = useSearch();

  // 결제 처리 훅
  const { completeOrder } = useCheckout(
    () => setCart([]),
    () => setSelectedCoupon(null),
    (message) => addNotification(message, 'success'),
  );

  // 계산된 데이터
  const totals = calculateCartTotal(cart, selectedCoupon);
  const filteredProductList = filteredProducts(products, debouncedQuery);

  return (
    <div className='min-h-screen bg-gray-50'>
      {notifications.length > 0 && (
        <div className='fixed top-20 right-4 z-50 space-y-2 max-w-sm'>
          {notifications.map((notification) => (
            <Toast
              key={notification.id}
              type={notification.type}
              message={notification.message}
              onClose={() =>
                setNotifications((prev) => prev.filter((n) => n.id !== notification.id))
              }
            />
          ))}
        </div>
      )}
      <Header
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
        query={query}
        setQuery={setQuery}
        cart={cart}
        totalCartItem={totalCartItem}
      />

      <main className='max-w-7xl mx-auto px-4 py-8'>
        {isAdmin ? (
          <AdminDashboard
            products={products}
            isAdmin={isAdmin}
            cart={cart}
            editingProduct={editingProduct}
            productForm={productForm}
            coupons={coupons}
            couponForm={couponForm}
            onEditClick={setEditingProduct}
            onFormChange={setProductForm}
            handleProductEdit={handleProductEdit}
            onProductDelete={deleteProduct}
            handleProductSubmit={handleProductSubmit}
            onCouponDelete={deleteCoupon}
            onCouponSubmit={handleCouponSubmit}
            onCouponFormChange={setCouponForm}
            onNotify={addNotification}
          />
        ) : (
          <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
            <div className='lg:col-span-3'>
              {/* 상품 목록 */}
              <section>
                <div className='mb-6 flex justify-between items-center'>
                  <h2 className='text-2xl font-semibold text-gray-800'>전체 상품</h2>
                  <div className='text-sm text-gray-600'>총 {products.length}개 상품</div>
                </div>
                {filteredProductList.length === 0 ? (
                  <div className='text-center py-12'>
                    <p className='text-gray-500'>"{debouncedQuery}"에 대한 검색 결과가 없습니다.</p>
                  </div>
                ) : (
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {filteredProductList?.map((product) => {
                      const remainingStock = getRemainingStock(product, cart);

                      return (
                        <ProductCard
                          key={product.id}
                          product={product}
                          cart={cart}
                          isAdmin={isAdmin}
                          remainingStock={remainingStock}
                          addToCart={addToCart}
                        />
                      );
                    })}
                  </div>
                )}
              </section>
            </div>
            {/* 장바구니 쪽 */}
            <Cart
              cart={cart}
              coupons={coupons}
              selectedCoupon={selectedCoupon}
              totals={totals}
              onRemoveFromCart={removeFromCart}
              onUpdateQuantity={updateQuantity}
              onApplyCoupon={applyCoupon}
              onSelectedCouponChange={setSelectedCoupon}
              onCompleteOrder={completeOrder}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
