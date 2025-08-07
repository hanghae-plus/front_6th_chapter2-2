import { useState, useCallback, useEffect } from 'react';
import { CartItem, Product } from '../types';
import { Products } from './constants/products';
import { useNotification } from './hooks/useNotification';
import { useProducts } from './hooks/useProducts';
import { useCoupons } from './hooks/useCoupons';
import { useCart } from './hooks/useCart';
import { useSearchTerm } from './hooks/useSearchTerm';
import Header from './components/ui/layout/Header';
import Notification from './components/ui/notification/Notification';
import ProductList from './components/ui/product/ProductList';

import { CloseIcon, PlusIcon, ShoppingBagIcon, LargeShoppingBagIcon } from './components/icons';
import { TabLayout } from './components/ui/layout/TabLayout';
import ProductTable from './components/ui/product/ProductTable';
import ProductForm from './components/ui/product/ProductForm';
import CouponGrid from './components/ui/coupon/CouponCard';
import CouponForm from './components/ui/coupon/CouponForm';
import CouponSelector from './components/ui/coupon/CouponSelector';

const App = () => {
  const { notifications, addNotification, setNotifications } = useNotification();
  const { products, updateProduct, addProduct, deleteProduct } = useProducts();
  const { coupons, addCoupon, removeCoupon } = useCoupons();
  const {
    cart,
    selectedCoupon,
    setSelectedCoupon,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    calculateCartTotal,
    getRemainingStock,
    clearCart,
  } = useCart(addNotification);

  const { searchTerm, handleSearchTerm, debouncedSearchTerm } = useSearchTerm();
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

  const getMaxApplicableDiscount = (item: CartItem): number => {
    const { discounts } = item.product;
    const { quantity } = item;

    const baseDiscount = discounts.reduce((maxDiscount, discount) => {
      return quantity >= discount.quantity && discount.rate > maxDiscount
        ? discount.rate
        : maxDiscount;
    }, 0);

    const hasBulkPurchase = cart.some((cartItem) => cartItem.quantity >= 10);
    if (hasBulkPurchase) {
      return Math.min(baseDiscount + 0.05, 0.5); // 대량 구매 시 추가 5% 할인
    }

    return baseDiscount;
  };

  const calculateItemTotal = (item: CartItem): number => {
    const { price } = item.product;
    const { quantity } = item;
    const discount = getMaxApplicableDiscount(item);

    return Math.round(price * quantity * (1 - discount));
  };

  const [totalItemCount, setTotalItemCount] = useState(0);

  useEffect(() => {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    setTotalItemCount(count);
  }, [cart]);

  const completeOrder = useCallback(() => {
    const orderNumber = `ORD-${Date.now()}`;
    addNotification(`주문이 완료되었습니다. 주문번호: ${orderNumber}`, 'success');
    clearCart();
  }, [addNotification]);

  const startEditProduct = (product: (typeof Products)[number]) => {
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

  const handleActiveTab = (value: 'products' | 'coupons') => {
    setActiveTab(value);
  };

  const totals = calculateCartTotal();

  return (
    <div className='min-h-screen bg-gray-50'>
      <Notification notifications={notifications} setNotifications={setNotifications} />
      <Header
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
        searchTerm={searchTerm}
        handleSearchTerm={handleSearchTerm}
        cartTotalItem={totalItemCount}
      />

      <main className='max-w-7xl mx-auto px-4 py-8'>
        {isAdmin ? (
          <div className='max-w-6xl mx-auto'>
            <div className='mb-8'>
              <h1 className='text-2xl font-bold text-gray-900'>관리자 대시보드</h1>
              <p className='text-gray-600 mt-1'>상품과 쿠폰을 관리할 수 있습니다</p>
            </div>
            <div className='border-b border-gray-200 mb-6'>
              <TabLayout activeTab={activeTab} handleActiveTab={handleActiveTab} />
            </div>

            {activeTab === 'products' ? (
              <section className='bg-white rounded-lg border border-gray-200'>
                <div className='p-6 border-b border-gray-200'>
                  <div className='flex justify-between items-center'>
                    <h2 className='text-lg font-semibold'>상품 목록</h2>
                    <button
                      onClick={() => {
                        setEditingProduct('new');
                        setProductForm({
                          name: '',
                          price: 0,
                          stock: 0,
                          description: '',
                          discounts: [],
                        });
                        setShowProductForm(true);
                      }}
                      className='px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800'
                    >
                      새 상품 추가
                    </button>
                  </div>
                </div>

                <div className='overflow-x-auto'>
                  <ProductTable
                    products={products as Product[]}
                    getRemainingStock={getRemainingStock}
                    startEditProduct={startEditProduct}
                    deleteProductItem={deleteProduct}
                  />
                </div>
                {showProductForm && (
                  <ProductForm
                    setShowProductForm={setShowProductForm}
                    addProduct={addProduct}
                    updateProduct={updateProduct}
                    editingProduct={editingProduct}
                    setEditingProduct={setEditingProduct}
                    productForm={productForm}
                    setProductForm={setProductForm}
                    addNotification={addNotification}
                  />
                )}
              </section>
            ) : (
              <section className='bg-white rounded-lg border border-gray-200'>
                <div className='p-6 border-b border-gray-200'>
                  <h2 className='text-lg font-semibold'>쿠폰 관리</h2>
                </div>
                <div className='p-6'>
                  <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                    {coupons.map((coupon) => (
                      <CouponGrid key={coupon.code} coupon={coupon} deleteCoupon={removeCoupon} />
                    ))}

                    <div className='border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center hover:border-gray-400 transition-colors'>
                      <button
                        onClick={() => setShowCouponForm(!showCouponForm)}
                        className='text-gray-400 hover:text-gray-600 flex flex-col items-center'
                      >
                        <PlusIcon />
                        <p className='mt-2 text-sm font-medium'>새 쿠폰 추가</p>
                      </button>
                    </div>
                  </div>

                  {showCouponForm && (
                    <CouponForm
                      coupons={coupons}
                      setShowCouponForm={setShowCouponForm}
                      addCoupon={addCoupon}
                      addNotification={addNotification}
                    />
                  )}
                </div>
              </section>
            )}
          </div>
        ) : (
          <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
            <div className='lg:col-span-3'>
              {/* 상품 목록 */}
              <ProductList
                products={products as Product[]}
                getRemainingStock={getRemainingStock}
                addToCart={addToCart}
                debouncedSearchTerm={debouncedSearchTerm}
              />
            </div>

            <div className='lg:col-span-1'>
              <div className='sticky top-24 space-y-4'>
                <section className='bg-white rounded-lg border border-gray-200 p-4'>
                  <h2 className='text-lg font-semibold mb-4 flex items-center'>
                    <ShoppingBagIcon />
                    장바구니
                  </h2>
                  {cart.length === 0 ? (
                    <div className='text-center py-8'>
                      <LargeShoppingBagIcon />
                      <p className='text-gray-500 text-sm'>장바구니가 비어있습니다</p>
                    </div>
                  ) : (
                    <div className='space-y-3'>
                      {cart.map((item) => {
                        const itemTotal = calculateItemTotal(item);
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
                              <button
                                onClick={() => removeFromCart(item.product.id)}
                                className='text-gray-400 hover:text-red-500 ml-2'
                              >
                                <CloseIcon />
                              </button>
                            </div>
                            <div className='flex items-center justify-between'>
                              <div className='flex items-center'>
                                <button
                                  onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                  className='w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100'
                                >
                                  <span className='text-xs'>−</span>
                                </button>
                                <span className='mx-3 text-sm font-medium w-8 text-center'>
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                  className='w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100'
                                >
                                  <span className='text-xs'>+</span>
                                </button>
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
                    <CouponSelector
                      coupons={coupons}
                      selectedCoupon={selectedCoupon}
                      setSelectedCoupon={setSelectedCoupon}
                      applyCoupon={applyCoupon}
                    />

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
