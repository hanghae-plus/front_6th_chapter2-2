import { Provider, useAtom } from 'jotai';
import { useCallback } from 'react';

import {
  productsAtom,
  couponsAtom,
  selectedCouponAtom,
  isAdminAtom,
  showCouponFormAtom,
  activeTabAtom,
  showProductFormAtom,
  editingProductAtom,
  productFormAtom,
  couponFormAtom,
  cartAtom,
  notificationsAtom,
} from './atoms';
import {
  Header,
  ProductList,
  Cart,
  NotificationList,
  AdminPanel,
  ProductManagement,
  CouponManagement,
} from './components';
import { calculateCartTotal, formatPrice as formatPriceUtil } from './utils';

const App = () => {
  return (
    <Provider>
      <AppContent />
    </Provider>
  );
};

const AppContent = () => {
  // Atoms 사용
  const [products, setProducts] = useAtom(productsAtom);
  const [coupons, setCoupons] = useAtom(couponsAtom);
  const [selectedCoupon, setSelectedCoupon] = useAtom(selectedCouponAtom);
  const [isAdmin] = useAtom(isAdminAtom);
  const [showCouponForm, setShowCouponForm] = useAtom(showCouponFormAtom);
  const [activeTab, setActiveTab] = useAtom(activeTabAtom);
  const [showProductForm, setShowProductForm] = useAtom(showProductFormAtom);
  const [editingProduct, setEditingProduct] = useAtom(editingProductAtom);
  const [productForm, setProductForm] = useAtom(productFormAtom);
  const [couponForm, setCouponForm] = useAtom(couponFormAtom);
  const [cart, setCart] = useAtom(cartAtom);
  const [, setNotifications] = useAtom(notificationsAtom);

  // Notification functions
  const addNotification = useCallback(
    (message: string, type: 'success' | 'error' | 'warning' = 'success') => {
      const notification = {
        id: Date.now().toString(),
        message,
        type,
        timestamp: Date.now(),
      };
      setNotifications((prev) => [...prev, notification]);
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== notification.id));
      }, 3000);
    },
    [setNotifications]
  );

  const clearCart = useCallback(() => {
    setCart([]);
  }, [setCart]);

  // Coupon functions
  const addCoupon = useCallback(
    (couponData: typeof couponForm) => {
      const newCoupon: (typeof coupons)[0] = {
        name: couponData.name,
        code: couponData.code,
        discountType: couponData.discountType,
        discountValue: couponData.discountValue,
      };
      setCoupons((prev) => [...prev, newCoupon]);
      addNotification('쿠폰이 추가되었습니다.', 'success');
    },
    [setCoupons, addNotification]
  );

  const deleteCoupon = useCallback(
    (code: string) => {
      setCoupons((prev) => prev.filter((c) => c.code !== code));
      addNotification('쿠폰이 삭제되었습니다.', 'warning');
    },
    [setCoupons, addNotification]
  );

  const applyCoupon = useCallback(
    (coupon: (typeof coupons)[0]) => {
      setSelectedCoupon(coupon);
      addNotification('쿠폰이 적용되었습니다.', 'success');
    },
    [setSelectedCoupon, addNotification]
  );

  // Product functions
  const addProduct = useCallback(
    (productData: typeof productForm) => {
      const newProduct = {
        id: `p${Date.now()}`,
        name: productData.name,
        price: productData.price,
        stock: productData.stock,
        description: productData.description,
        discounts: productData.discounts,
      };
      setProducts((prev) => [...prev, newProduct]);
      addNotification('상품이 추가되었습니다.', 'success');
    },
    [setProducts, addNotification]
  );

  const updateProduct = useCallback(
    (productId: string, productData: typeof productForm) => {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId
            ? {
                ...p,
                name: productData.name,
                price: productData.price,
                stock: productData.stock,
                description: productData.description,
                discounts: productData.discounts,
              }
            : p
        )
      );
      addNotification('상품이 수정되었습니다.', 'success');
    },
    [setProducts, addNotification]
  );

  const deleteProduct = useCallback(
    (productId: string) => {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      addNotification('상품이 삭제되었습니다.', 'warning');
    },
    [setProducts, addNotification]
  );

  const formatPrice = useCallback(
    (price: number, productId?: string): string => {
      return formatPriceUtil(price, productId, products, cart, isAdmin);
    },
    [products, cart, isAdmin]
  );

  const completeOrder = useCallback(() => {
    const orderNumber = `ORD-${Date.now()}`;
    addNotification(`주문이 완료되었습니다. 주문번호: ${orderNumber}`, 'success');
    clearCart();
    setSelectedCoupon(null);
  }, [addNotification, clearCart, setSelectedCoupon]);

  const handleProductSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (editingProduct && editingProduct !== 'new') {
        updateProduct(editingProduct, productForm);
        setEditingProduct(null);
      } else {
        addProduct(productForm);
      }
      setProductForm({ name: '', price: 0, stock: 0, description: '', discounts: [] });
      setEditingProduct(null);
      setShowProductForm(false);
    },
    [
      editingProduct,
      productForm,
      updateProduct,
      addProduct,
      setProductForm,
      setEditingProduct,
      setShowProductForm,
    ]
  );

  const handleCouponSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      addCoupon(couponForm);
      setCouponForm({
        name: '',
        code: '',
        discountType: 'amount',
        discountValue: 0,
      });
      setShowCouponForm(false);
    },
    [addCoupon, couponForm, setCouponForm, setShowCouponForm]
  );

  const startEditProduct = useCallback(
    (product: (typeof products)[0]) => {
      setEditingProduct(product.id);
      setProductForm({
        name: product.name,
        price: product.price,
        stock: product.stock,
        description: product.description || '',
        discounts: product.discounts || [],
      });
      setShowProductForm(true);
    },
    [setEditingProduct, setProductForm, setShowProductForm]
  );

  const totals = calculateCartTotal(cart, selectedCoupon);

  return (
    <div className='min-h-screen bg-gray-50'>
      <NotificationList />
      <Header />

      <main className='max-w-7xl mx-auto px-4 py-8'>
        {isAdmin ? (
          <AdminPanel activeTab={activeTab} setActiveTab={setActiveTab}>
            {activeTab === 'products' ? (
              <ProductManagement
                products={products}
                showProductForm={showProductForm}
                editingProduct={editingProduct}
                productForm={productForm}
                formatPrice={formatPrice}
                deleteProduct={deleteProduct}
                startEditProduct={startEditProduct}
                handleProductSubmit={handleProductSubmit}
                setProductForm={setProductForm}
                setShowProductForm={setShowProductForm}
                setEditingProduct={setEditingProduct}
              />
            ) : (
              <CouponManagement
                coupons={coupons}
                showCouponForm={showCouponForm}
                couponForm={couponForm}
                deleteCoupon={deleteCoupon}
                handleCouponSubmit={handleCouponSubmit}
                setCouponForm={setCouponForm}
                setShowCouponForm={setShowCouponForm}
                addNotification={addNotification}
              />
            )}
          </AdminPanel>
        ) : (
          <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
            <div className='lg:col-span-3'>
              <ProductList />
            </div>

            <div className='lg:col-span-1'>
              <div className='sticky top-24 space-y-4'>
                <Cart />

                {cart.length > 0 && (
                  <>
                    <section className='bg-white rounded-lg border border-gray-200 p-4'>
                      <div className='flex items-center justify-between mb-3'>
                        <h3 className='text-sm font-semibold text-gray-700'>쿠폰 할인</h3>
                        <button className='text-xs text-blue-600 hover:underline'>쿠폰 등록</button>
                      </div>
                      {coupons.length > 0 && (
                        <select
                          className='w-full text-sm border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500'
                          value={selectedCoupon?.code || ''}
                          onChange={(e) => {
                            const coupon = coupons.find((c) => c.code === e.target.value);
                            if (coupon) applyCoupon(coupon);
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

                      <button
                        onClick={completeOrder}
                        className='w-full mt-4 py-3 bg-yellow-400 text-gray-900 rounded-md font-medium hover:bg-yellow-500 transition-colors'
                      >
                        {totals.totalAfterDiscount.toLocaleString()}원 결제하기
                      </button>

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
