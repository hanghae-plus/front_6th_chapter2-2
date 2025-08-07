import { useState, useCallback, useEffect } from 'react';
import { CartItem, Product } from '../types';
import { formatPriceWithStock } from './utils/formatters';
import { Products } from './constants/products';
import { useNotification } from './hooks/useNotification';
import { useProducts } from './hooks/useProducts';
import { useCoupons } from './hooks/useCoupons';
import { useCart } from './hooks/useCart';
import { useSearchTerm } from './hooks/useSearchTerm';
import Header from './components/ui/layout/Header';
import Notification from './components/ui/notification/Notification';
import ProductList from './components/ui/product/ProductList';

import {
  CloseIcon,
  TrashIcon,
  PlusIcon,
  ShoppingBagIcon,
  LargeShoppingBagIcon,
} from './components/icons';
import { TabLayout } from './components/ui/layout/TabLayout';
import ProductTable from './components/ui/product/ProductTable';

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

  const isSoldOut = (productId: string): boolean => {
    const product = products.find((p) => p.id === productId);
    if (product && getRemainingStock(product as Product) <= 0) {
      return true;
    }
    return false;
  };

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

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct && editingProduct !== 'new') {
      updateProduct(editingProduct, productForm);
      addNotification('상품이 수정되었습니다.', 'success');
      setEditingProduct(null);
    } else {
      addProduct({
        ...productForm,
        discounts: productForm.discounts,
        filter: '',
        isRecommended: false,
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
                  <div className='p-6 border-t border-gray-200 bg-gray-50'>
                    <form onSubmit={handleProductSubmit} className='space-y-4'>
                      <h3 className='text-lg font-medium text-gray-900'>
                        {editingProduct === 'new' ? '새 상품 추가' : '상품 수정'}
                      </h3>
                      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                        <div>
                          <label className='block text-sm font-medium text-gray-700 mb-1'>
                            상품명
                          </label>
                          <input
                            type='text'
                            value={productForm.name}
                            onChange={(e) =>
                              setProductForm({ ...productForm, name: e.target.value })
                            }
                            className='w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border'
                            required
                          />
                        </div>
                        <div>
                          <label className='block text-sm font-medium text-gray-700 mb-1'>
                            설명
                          </label>
                          <input
                            type='text'
                            value={productForm.description}
                            onChange={(e) =>
                              setProductForm({ ...productForm, description: e.target.value })
                            }
                            className='w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border'
                          />
                        </div>
                        <div>
                          <label className='block text-sm font-medium text-gray-700 mb-1'>
                            가격
                          </label>
                          <input
                            type='text'
                            value={productForm.price === 0 ? '' : productForm.price}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value === '' || /^\d+$/.test(value)) {
                                setProductForm({
                                  ...productForm,
                                  price: value === '' ? 0 : parseInt(value),
                                });
                              }
                            }}
                            onBlur={(e) => {
                              const value = e.target.value;
                              if (value === '') {
                                setProductForm({ ...productForm, price: 0 });
                              } else if (parseInt(value) < 0) {
                                addNotification('가격은 0보다 커야 합니다', 'error');
                                setProductForm({ ...productForm, price: 0 });
                              }
                            }}
                            className='w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border'
                            placeholder='숫자만 입력'
                            required
                          />
                        </div>
                        <div>
                          <label className='block text-sm font-medium text-gray-700 mb-1'>
                            재고
                          </label>
                          <input
                            type='text'
                            value={productForm.stock === 0 ? '' : productForm.stock}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value === '' || /^\d+$/.test(value)) {
                                setProductForm({
                                  ...productForm,
                                  stock: value === '' ? 0 : parseInt(value),
                                });
                              }
                            }}
                            onBlur={(e) => {
                              const value = e.target.value;
                              if (value === '') {
                                setProductForm({ ...productForm, stock: 0 });
                              } else if (parseInt(value) < 0) {
                                addNotification('재고는 0보다 커야 합니다', 'error');
                                setProductForm({ ...productForm, stock: 0 });
                              } else if (parseInt(value) > 9999) {
                                addNotification('재고는 9999개를 초과할 수 없습니다', 'error');
                                setProductForm({ ...productForm, stock: 9999 });
                              }
                            }}
                            className='w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border'
                            placeholder='숫자만 입력'
                            required
                          />
                        </div>
                      </div>
                      <div className='mt-4'>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                          할인 정책
                        </label>
                        <div className='space-y-2'>
                          {productForm.discounts.map((discount, index) => (
                            <div
                              key={index}
                              className='flex items-center gap-2 bg-gray-50 p-2 rounded'
                            >
                              <input
                                type='number'
                                value={discount.quantity}
                                onChange={(e) => {
                                  const newDiscounts = [...productForm.discounts];
                                  newDiscounts[index].quantity = parseInt(e.target.value) || 0;
                                  setProductForm({ ...productForm, discounts: newDiscounts });
                                }}
                                className='w-20 px-2 py-1 border rounded'
                                min='1'
                                placeholder='수량'
                              />
                              <span className='text-sm'>개 이상 구매 시</span>
                              <input
                                type='number'
                                value={discount.rate * 100}
                                onChange={(e) => {
                                  const newDiscounts = [...productForm.discounts];
                                  newDiscounts[index].rate = (parseInt(e.target.value) || 0) / 100;
                                  setProductForm({ ...productForm, discounts: newDiscounts });
                                }}
                                className='w-16 px-2 py-1 border rounded'
                                min='0'
                                max='100'
                                placeholder='%'
                              />
                              <span className='text-sm'>% 할인</span>
                              <button
                                type='button'
                                onClick={() => {
                                  const newDiscounts = productForm.discounts.filter(
                                    (_, i) => i !== index,
                                  );
                                  setProductForm({ ...productForm, discounts: newDiscounts });
                                }}
                                className='text-red-600 hover:text-red-800'
                              >
                                <CloseIcon />
                              </button>
                            </div>
                          ))}
                          <button
                            type='button'
                            onClick={() => {
                              setProductForm({
                                ...productForm,
                                discounts: [...productForm.discounts, { quantity: 10, rate: 0.1 }],
                              });
                            }}
                            className='text-sm text-indigo-600 hover:text-indigo-800'
                          >
                            + 할인 추가
                          </button>
                        </div>
                      </div>

                      <div className='flex justify-end gap-3'>
                        <button
                          type='button'
                          onClick={() => {
                            setEditingProduct(null);
                            setProductForm({
                              name: '',
                              price: 0,
                              stock: 0,
                              description: '',
                              discounts: [],
                            });
                            setShowProductForm(false);
                          }}
                          className='px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50'
                        >
                          취소
                        </button>
                        <button
                          type='submit'
                          className='px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700'
                        >
                          {editingProduct === 'new' ? '추가' : '수정'}
                        </button>
                      </div>
                    </form>
                  </div>
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
                      <div
                        key={coupon.code}
                        className='relative bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-200'
                      >
                        <div className='flex justify-between items-start'>
                          <div className='flex-1'>
                            <h3 className='font-semibold text-gray-900'>{coupon.name}</h3>
                            <p className='text-sm text-gray-600 mt-1 font-mono'>{coupon.code}</p>
                            <div className='mt-2'>
                              <span className='inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white text-indigo-700'>
                                {coupon.discountType === 'amount'
                                  ? `${coupon.discountValue.toLocaleString()}원 할인`
                                  : `${coupon.discountValue}% 할인`}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => removeCoupon(coupon.code)}
                            className='text-gray-400 hover:text-red-600 transition-colors'
                          >
                            <TrashIcon />
                          </button>
                        </div>
                      </div>
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
                    <div className='mt-6 p-4 bg-gray-50 rounded-lg'>
                      <form onSubmit={handleCouponSubmit} className='space-y-4'>
                        <h3 className='text-md font-medium text-gray-900'>새 쿠폰 생성</h3>
                        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
                          <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>
                              쿠폰명
                            </label>
                            <input
                              type='text'
                              value={couponForm.name}
                              onChange={(e) =>
                                setCouponForm({ ...couponForm, name: e.target.value })
                              }
                              className='w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm'
                              placeholder='신규 가입 쿠폰'
                              required
                            />
                          </div>
                          <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>
                              쿠폰 코드
                            </label>
                            <input
                              type='text'
                              value={couponForm.code}
                              onChange={(e) =>
                                setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })
                              }
                              className='w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm font-mono'
                              placeholder='WELCOME2024'
                              required
                            />
                          </div>
                          <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>
                              할인 타입
                            </label>
                            <select
                              value={couponForm.discountType}
                              onChange={(e) =>
                                setCouponForm({
                                  ...couponForm,
                                  discountType: e.target.value as 'amount' | 'percentage',
                                })
                              }
                              className='w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm'
                            >
                              <option value='amount'>정액 할인</option>
                              <option value='percentage'>정률 할인</option>
                            </select>
                          </div>
                          <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>
                              {couponForm.discountType === 'amount' ? '할인 금액' : '할인율(%)'}
                            </label>
                            <input
                              type='text'
                              value={couponForm.discountValue === 0 ? '' : couponForm.discountValue}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value === '' || /^\d+$/.test(value)) {
                                  setCouponForm({
                                    ...couponForm,
                                    discountValue: value === '' ? 0 : parseInt(value),
                                  });
                                }
                              }}
                              onBlur={(e) => {
                                const value = parseInt(e.target.value) || 0;
                                if (couponForm.discountType === 'percentage') {
                                  if (value > 100) {
                                    addNotification('할인율은 100%를 초과할 수 없습니다', 'error');
                                    setCouponForm({ ...couponForm, discountValue: 100 });
                                  } else if (value < 0) {
                                    setCouponForm({ ...couponForm, discountValue: 0 });
                                  }
                                } else {
                                  if (value > 100000) {
                                    addNotification(
                                      '할인 금액은 100,000원을 초과할 수 없습니다',
                                      'error',
                                    );
                                    setCouponForm({ ...couponForm, discountValue: 100000 });
                                  } else if (value < 0) {
                                    setCouponForm({ ...couponForm, discountValue: 0 });
                                  }
                                }
                              }}
                              className='w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm'
                              placeholder={couponForm.discountType === 'amount' ? '5000' : '10'}
                              required
                            />
                          </div>
                        </div>
                        <div className='flex justify-end gap-3'>
                          <button
                            type='button'
                            onClick={() => setShowCouponForm(false)}
                            className='px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50'
                          >
                            취소
                          </button>
                          <button
                            type='submit'
                            className='px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700'
                          >
                            쿠폰 생성
                          </button>
                        </div>
                      </form>
                    </div>
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
