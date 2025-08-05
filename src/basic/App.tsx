import { useState } from 'react';
import Button from './components/ui/Button';
import IconButton from './components/ui/IconButton';
import Tab from './components/ui/Tab';
import Toast from './components/ui/Toast';
import Header from './components/ui/Header';
import { useProducts } from './hooks/product/useProducts';
import { useNotifications } from './hooks/notifications/useNotifications';
import { useProductForm } from './hooks/product/useProductForm';
import { getRemainingStock } from './utils/calculations/stockCalculations';
import { formatPriceWithSoldOut } from './utils/formatters/priceFormatter';
import { useCoupons } from './hooks/coupons/useCoupons';
import { calculateCartTotal, calculateItemTotal } from './utils/calculations/cartCalculations';
import { useCouponsForm } from './hooks/coupons/useCouponsForm';
import { useCart } from './hooks/cart/useCart';
import useCheckout from './hooks/checkout/useCheckout';
import { filteredProducts } from './utils/calculations/productCalculations';
import { useSearch } from './hooks/search/useSearch';
import Input from './components/ui/Input';
import ProductManagement from './components/admin/ProductManagement';
import CouponsManagement from './components/admin/CouponsManagement';

const App = () => {
  const { products, deleteProduct, updateProduct, addProduct } = useProducts();
  const { notifications, setNotifications, addNotification } = useNotifications();

  const {
    productForm,
    setProductForm,
    editingProduct,
    setEditingProduct,
    handleProductSubmit,
    handleProductEdit,
  } = useProductForm(addProduct, updateProduct);

  // coupons---------------------!!
  const { coupons, setCoupons, selectedCoupon, setSelectedCoupon, applyCoupon } = useCoupons(
    (message) => addNotification(message, 'success'),
    (message) => addNotification(message, 'error'),
  );

  const { couponForm, setCouponForm, deleteCoupon, handleCouponSubmit } = useCouponsForm(
    coupons,
    setCoupons,
    selectedCoupon,
    setSelectedCoupon,
    (message) => addNotification(message, 'success'),
    (message) => addNotification(message, 'error'),
    (message) => addNotification(message, 'success'),
  );

  const [isAdmin, setIsAdmin] = useState(false); // admin ui
  const [showCouponForm, setShowCouponForm] = useState(false); // 쿠폰 ui
  const [activeTab, setActiveTab] = useState<'products' | 'coupons'>('products'); // tab ui
  const [showProductForm, setShowProductForm] = useState(false);

  // Admin

  // cart---------------------!!
  const { cart, setCart, totalCartItem, addToCart, removeFromCart, updateQuantity } = useCart(
    products,
    (message) => addNotification(message, 'success'),
    (message) => addNotification(message, 'error'),
  );

  // checkout -----------------!!

  const { completeOrder } = useCheckout(
    () => setCart([]),
    () => setSelectedCoupon(null),
    (message) => addNotification(message, 'success'),
  );

  // search --------------- !!
  const { query, setQuery, debouncedQuery } = useSearch();

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
          <div className='max-w-6xl mx-auto'>
            <div className='mb-8'>
              <h1 className='text-2xl font-bold text-gray-900'>관리자 대시보드</h1>
              <p className='text-gray-600 mt-1'>상품과 쿠폰을 관리할 수 있습니다</p>
            </div>
            <div className='border-b border-gray-200 mb-6'>
              <nav className='-mb-px flex space-x-8'>
                <Tab isActive={activeTab === 'products'} onClick={() => setActiveTab('products')}>
                  상품 관리
                </Tab>
                <Tab isActive={activeTab === 'coupons'} onClick={() => setActiveTab('coupons')}>
                  쿠폰 관리
                </Tab>
              </nav>
            </div>

            {activeTab === 'products' ? (
              <ProductManagement
                products={products}
                isAdmin={isAdmin}
                cart={cart}
                editingProduct={editingProduct}
                productForm={productForm}
                showProductForm={showProductForm}
                handleProductEdit={handleProductEdit}
                handleProductSubmit={handleProductSubmit}
                onEditClick={setEditingProduct}
                onFormChange={setProductForm}
                onToggleForm={setShowProductForm}
                onProductDelete={deleteProduct}
                onNotify={addNotification}
              />
            ) : (
              <CouponsManagement
                coupons={coupons}
                showCouponForm={showCouponForm}
                couponForm={couponForm}
                onCouponDelete={deleteCoupon}
                onToggleForm={setShowCouponForm}
                onCouponSubmit={handleCouponSubmit}
                onCouponFormChange={setCouponForm}
                onNotify={addNotification}
              />
            )}
          </div>
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
                        <div
                          key={product.id}
                          className='bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow'
                        >
                          {/* 상품 이미지 영역 (placeholder) */}
                          <div className='relative'>
                            <div className='aspect-square bg-gray-100 flex items-center justify-center'>
                              <svg
                                className='w-24 h-24 text-gray-300'
                                fill='none'
                                stroke='currentColor'
                                viewBox='0 0 24 24'
                              >
                                <path
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                  strokeWidth={1}
                                  d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
                                />
                              </svg>
                            </div>
                            {product.isRecommended && (
                              <span className='absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded'>
                                BEST
                              </span>
                            )}
                            {product.discounts.length > 0 && (
                              <span className='absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded'>
                                ~{Math.max(...product.discounts.map((d) => d.rate)) * 100}%
                              </span>
                            )}
                          </div>

                          {/* 상품 정보 */}
                          <div className='p-4'>
                            <h3 className='font-medium text-gray-900 mb-1'>{product.name}</h3>
                            {product.description && (
                              <p className='text-sm text-gray-500 mb-2 line-clamp-2'>
                                {product.description}
                              </p>
                            )}

                            {/* 가격 정보 */}
                            <div className='mb-3'>
                              <p className='text-lg font-bold text-gray-900'>
                                {formatPriceWithSoldOut(
                                  product.price,
                                  isAdmin,
                                  getRemainingStock(product, cart) <= 0,
                                )}
                              </p>
                              {product.discounts.length > 0 && (
                                <p className='text-xs text-gray-500'>
                                  {product.discounts[0].quantity}개 이상 구매시 할인{' '}
                                  {product.discounts[0].rate * 100}%
                                </p>
                              )}
                            </div>

                            {/* 재고 상태 */}
                            <div className='mb-3'>
                              {remainingStock <= 5 && remainingStock > 0 && (
                                <p className='text-xs text-red-600 font-medium'>
                                  품절임박! {remainingStock}개 남음
                                </p>
                              )}
                              {remainingStock > 5 && (
                                <p className='text-xs text-gray-500'>재고 {remainingStock}개</p>
                              )}
                            </div>

                            {/* 장바구니 버튼 */}

                            <Button
                              variant='primary'
                              size='lg'
                              disabled={remainingStock <= 0}
                              onClick={() => addToCart(product)}
                              className='w-full'
                            >
                              {remainingStock <= 0 ? '품절' : '장바구니 담기'}
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            </div>

            <div className='lg:col-span-1'>
              <div className='sticky top-24 space-y-4'>
                <section className='bg-white rounded-lg border border-gray-200 p-4'>
                  <h2 className='text-lg font-semibold mb-4 flex items-center'>
                    <svg
                      className='w-5 h-5 mr-2'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z'
                      />
                    </svg>
                    장바구니
                  </h2>
                  {cart.length === 0 ? (
                    <div className='text-center py-8'>
                      <svg
                        className='w-16 h-16 text-gray-300 mx-auto mb-4'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={1}
                          d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z'
                        />
                      </svg>
                      <p className='text-gray-500 text-sm'>장바구니가 비어있습니다</p>
                    </div>
                  ) : (
                    <div className='space-y-3'>
                      {cart.map((item) => {
                        const itemTotal = calculateItemTotal(item, cart);
                        const originalPrice = item.product.price * item.quantity;
                        const hasDiscount = itemTotal < originalPrice;
                        const discountRate = hasDiscount
                          ? Math.round((1 - itemTotal / originalPrice) * 100)
                          : 0;

                        return (
                          <div key={item.product.id} className='border-b pb-3 last:border-b-0'>
                            <div className='flex justify-between items-start mb-2'>
                              <h4 className='text-sm font-medium text-gray-900 flex-1'>
                                {item.product.name}
                              </h4>

                              <IconButton
                                variant='danger'
                                onClick={() => removeFromCart(item.product.id)}
                              >
                                <svg
                                  className='w-4 h-4'
                                  fill='none'
                                  stroke='currentColor'
                                  viewBox='0 0 24 24'
                                >
                                  <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M6 18L18 6M6 6l12 12'
                                  />
                                </svg>
                              </IconButton>
                            </div>
                            <div className='flex items-center justify-between'>
                              <div className='flex items-center'>
                                <Button
                                  onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                  size='xs'
                                  variant='outline'
                                >
                                  <span className='text-xs'>−</span>
                                </Button>
                                <span className='mx-3 text-sm font-medium w-8 text-center'>
                                  {item.quantity}
                                </span>

                                <Button
                                  onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                  size='xs'
                                  variant='outline'
                                >
                                  <span className='text-xs'>+</span>
                                </Button>
                              </div>
                              <div className='text-right'>
                                {hasDiscount && (
                                  <span className='text-xs text-red-500 font-medium block'>
                                    -{discountRate}%
                                  </span>
                                )}
                                <p className='text-sm font-medium text-gray-900'>
                                  {Math.round(itemTotal).toLocaleString()}원
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </section>

                {cart.length > 0 && (
                  <>
                    <section className='bg-white rounded-lg border border-gray-200 p-4'>
                      <div className='flex items-center justify-between mb-3'>
                        <h3 className='text-sm font-semibold text-gray-700'>쿠폰 할인</h3>
                        <Button variant='link' className='text-xs'>
                          쿠폰 등록
                        </Button>
                      </div>
                      {coupons.length > 0 && (
                        <select
                          className='w-full text-sm border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500'
                          value={selectedCoupon?.code || ''}
                          onChange={(e) => {
                            const coupon = coupons.find((c) => c.code === e.target.value);
                            if (coupon) applyCoupon(coupon, cart);
                            else setSelectedCoupon(null);
                          }}
                        >
                          <option value=''>쿠폰 선택</option>
                          {coupons.map((coupon) => (
                            <option key={coupon.code} value={coupon.code}>
                              {coupon.name} (
                              {coupon.discountType === 'amount'
                                ? `${coupon.discountValue.toLocaleString()}원`
                                : `${coupon.discountValue}%`}
                              )
                            </option>
                          ))}
                        </select>
                      )}
                    </section>

                    <section className='bg-white rounded-lg border border-gray-200 p-4'>
                      <h3 className='text-lg font-semibold mb-4'>결제 정보</h3>
                      <div className='space-y-2 text-sm'>
                        <div className='flex justify-between'>
                          <span className='text-gray-600'>상품 금액</span>
                          <span className='font-medium'>
                            {totals.totalBeforeDiscount.toLocaleString()}원
                          </span>
                        </div>
                        {totals.totalBeforeDiscount - totals.totalAfterDiscount > 0 && (
                          <div className='flex justify-between text-red-500'>
                            <span>할인 금액</span>
                            <span>
                              -
                              {(
                                totals.totalBeforeDiscount - totals.totalAfterDiscount
                              ).toLocaleString()}
                              원
                            </span>
                          </div>
                        )}
                        <div className='flex justify-between py-2 border-t border-gray-200'>
                          <span className='font-semibold'>결제 예정 금액</span>
                          <span className='font-bold text-lg text-gray-900'>
                            {totals.totalAfterDiscount.toLocaleString()}원
                          </span>
                        </div>
                      </div>

                      {/* Todo :: primary - lg 사이즈 옵션 수정 */}
                      <Button
                        onClick={completeOrder}
                        size='lg'
                        className='w-full hover:bg-yellow-500 bg-yellow-400 !text-gray-900 mt-4 py-3'
                      >
                        {totals.totalAfterDiscount.toLocaleString()}원 결제하기
                      </Button>

                      <div className='mt-3 text-xs text-gray-500 text-center'>
                        <p>* 실제 결제는 이루어지지 않습니다</p>
                      </div>
                    </section>
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
