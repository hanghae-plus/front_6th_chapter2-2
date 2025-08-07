import { useState, useCallback } from 'react';

import { Coupon, Product } from '../types';
import {
  Header,
  ProductList,
  Cart,
  NotificationList,
  AdminPanel,
  ProductManagement,
  CouponManagement,
} from './components';
import {
  useLocalStorage,
  useNotification,
  useSearch,
  useCart,
  useCoupon,
  useProduct,
} from './hooks';
import { calculateCartTotal, formatPrice as formatPriceUtil, filterProducts } from './utils';

interface ProductWithUI extends Product {
  description?: string;
  isRecommended?: boolean;
}

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

const initialCoupons: Coupon[] = [
  {
    name: '5000원 할인',
    code: 'AMOUNT5000',
    discountType: 'amount',
    discountValue: 5000,
  },
  {
    name: '10% 할인',
    code: 'PERCENT10',
    discountType: 'percentage',
    discountValue: 10,
  },
];

const App = () => {
  // 커스텀 훅들 사용
  const [products, setProducts] = useLocalStorage<ProductWithUI[]>('products', initialProducts);
  const [coupons, setCoupons] = useLocalStorage<Coupon[]>('coupons', initialCoupons);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'products' | 'coupons'>('products');
  const [showProductForm, setShowProductForm] = useState(false);

  // Admin
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    price: 0,
    stock: 0,
    description: '',
    discounts: [] as Array<{ quantity: number; rate: number }>,
  });

  const [couponForm, setCouponForm] = useState({
    name: '',
    code: '',
    discountType: 'amount' as 'amount' | 'percentage',
    discountValue: 0,
  });

  // 커스텀 훅들
  const { notifications, addNotification, removeNotification } = useNotification();
  const { searchTerm, setSearchTerm, debouncedSearchTerm } = useSearch();
  const {
    cart,
    totalItemCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
  } = useCart(products, addNotification);
  const { addCoupon, deleteCoupon, applyCoupon } = useCoupon(
    coupons,
    setCoupons,
    selectedCoupon,
    setSelectedCoupon,
    addNotification,
    getCartTotal
  );
  const { addProduct, updateProduct, deleteProduct } = useProduct(
    setProducts,
    addNotification
  );

  const formatPrice = (price: number, productId?: string): string => {
    return formatPriceUtil(price, productId, products, cart, isAdmin);
  };

  const completeOrder = useCallback(() => {
    const orderNumber = `ORD-${Date.now()}`;
    addNotification(`주문이 완료되었습니다. 주문번호: ${orderNumber}`, 'success');
    clearCart();
    setSelectedCoupon(null);
  }, [addNotification, clearCart]);

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct && editingProduct !== 'new') {
      updateProduct(editingProduct, productForm);
      setEditingProduct(null);
    } else {
      addProduct({
        ...productForm,
        discounts: productForm.discounts,
      });
    }
    setProductForm({ name: '', price: 0, stock: 0, description: '', discounts: [] });
    setEditingProduct(null);
    setShowProductForm(false);
  };

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCoupon(couponForm);
    setCouponForm({
      name: '',
      code: '',
      discountType: 'amount',
      discountValue: 0,
    });
    setShowCouponForm(false);
  };

  const startEditProduct = (product: ProductWithUI) => {
    setEditingProduct(product.id);
    setProductForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
      description: product.description || '',
      discounts: product.discounts || [],
    });
    setShowProductForm(true);
  };

  const totals = calculateCartTotal(cart, selectedCoupon);

  const filteredProducts = filterProducts(products, debouncedSearchTerm);

  return (
    <div className='min-h-screen bg-gray-50'>
      <NotificationList notifications={notifications} removeNotification={removeNotification} />
      <Header
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        cartLength={cart.length}
        totalItemCount={totalItemCount}
      />

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
              <ProductList
                products={products}
                filteredProducts={filteredProducts}
                debouncedSearchTerm={debouncedSearchTerm}
                cart={cart}
                formatPrice={formatPrice}
                addToCart={addToCart}
              />
            </div>

            <div className='lg:col-span-1'>
              <div className='sticky top-24 space-y-4'>
                <Cart cart={cart} removeFromCart={removeFromCart} updateQuantity={updateQuantity} />

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
