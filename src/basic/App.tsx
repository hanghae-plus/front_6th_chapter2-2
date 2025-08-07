import { useState, useCallback } from 'react';

import { Coupon, ProductWithUI, Notification, ProductForm, CouponForm } from '../types';
import Cart from './components/Cart';
import Header from './components/Header';
import { CloseIcon, TrashIcon, PlusIcon } from './components/icons';
import NotificationComponent from './components/Notification';
import ProductList from './components/ProductList';
import Badge from './components/ui/Badge';
import Button from './components/ui/Button';
import Card from './components/ui/Card';
import Input from './components/ui/Input';
import Select from './components/ui/Selector';
import { defaultProductForm, defaultCouponForm } from './constants';
import { useCart } from './hooks/useCart';
import { useCoupons } from './hooks/useCoupons';
import { useProducts } from './hooks/useProducts';
import {
  formatCouponDisplay,
  validateCouponDiscountValue,
  getCouponDiscountLabel,
  getCouponDiscountPlaceholder,
} from './models/coupon';
import { formatPrice } from './utils/formatters';
import { useDebounce } from './utils/hooks/useDebounce';
import { isValidPrice, isValidStock } from './utils/validators';

const App = () => {
  // ===== 상태 관리 =====
  // useProducts Hook 사용
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();

  const [notifications, setNotifications] = useState<Notification[]>([]);

  // 알림 추가 함수
  const addNotification = useCallback(
    (message: string, type: 'success' | 'error' | 'warning' = 'success') => {
      const id = Date.now().toString();
      setNotifications((prev) => [...prev, { id, message, type }]);

      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, 3000);
    },
    []
  );

  // useCart Hook 사용
  const {
    cart,
    selectedCoupon,
    setSelectedCoupon,
    totalItemCount,
    calculateCartTotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    getRemainingStock,
    completeOrder,
  } = useCart(products);

  // useCoupons Hook 사용
  const { coupons, addCoupon, removeCoupon } = useCoupons();

  // 쿠폰 관련 UI 상태 관리
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [couponForm, setCouponForm] = useState<CouponForm>(defaultCouponForm);

  // 쿠폰 폼 제출 핸들러
  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCoupon(couponForm, addNotification);
    setCouponForm(defaultCouponForm);
    setShowCouponForm(false);
  };

  // 알림 콜백 함수들
  const handleAddToCart = useCallback(
    (product: ProductWithUI) => {
      addToCart(product, addNotification);
    },
    [addToCart, addNotification]
  );

  const handleUpdateQuantity = useCallback(
    (productId: string, newQuantity: number) => {
      updateQuantity(productId, newQuantity, addNotification);
    },
    [updateQuantity, addNotification]
  );

  const handleApplyCoupon = useCallback(
    (coupon: Coupon) => {
      applyCoupon(coupon, addNotification);
    },
    [applyCoupon, addNotification]
  );

  const handleCompleteOrder = useCallback(() => {
    completeOrder(addNotification);
  }, [completeOrder, addNotification]);

  const [isAdmin, setIsAdmin] = useState(false);

  const [activeTab, setActiveTab] = useState<'products' | 'coupons'>('products');
  const [showProductForm, setShowProductForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Admin
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [productForm, setProductForm] = useState<ProductForm>(defaultProductForm);

  // ===== localStorage 동기화 =====
  // products, cart, coupons는 각각의 custom hook 내부의 useLocalStorage를 통해 자동으로 동기화됩니다.

  // ===== UTILS: 유틸리티 함수들 =====
  // formatPrice 함수는 utils/formatters.ts로 분리됨

  // ===== MODELS: 순수 함수들 (UI와 관련된 로직 없음, 외부 상태에 의존하지 않음) =====

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct && editingProduct !== 'new') {
      updateProduct(editingProduct, productForm, addNotification);
      setEditingProduct(null);
    } else {
      addProduct(
        {
          ...productForm,
          discounts: productForm.discounts,
        },
        addNotification
      );
    }
    setProductForm(defaultProductForm);
    setEditingProduct(null);
    setShowProductForm(false);
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

  const totals = calculateCartTotal();

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* ===== ENTITY COMPONENTS: 엔티티 컴포넌트들 ===== */}
      {/* TODO: src/basic/components/Notification.tsx로 분리 - 알림 시스템 */}
      <NotificationComponent
        notifications={notifications}
        onRemoveNotification={(id) => setNotifications((prev) => prev.filter((n) => n.id !== id))}
      />
      {/* TODO: src/basic/components/Header.tsx로 분리 - 헤더 (네비게이션, 검색) */}
      <Header
        isAdmin={isAdmin}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setIsAdmin={setIsAdmin}
        cart={cart}
        totalItemCount={totalItemCount}
      />

      <main className='max-w-7xl mx-auto px-4 py-8'>
        {isAdmin ? (
          /* TODO: src/basic/components/AdminPage.tsx로 분리 - 관리자 페이지 */
          <div className='max-w-6xl mx-auto'>
            <div className='mb-8'>
              <h1 className='text-2xl font-bold text-gray-900'>관리자 대시보드</h1>
              <p className='text-gray-600 mt-1'>상품과 쿠폰을 관리할 수 있습니다</p>
            </div>
            <div className='border-b border-gray-200 mb-6'>
              <nav className='-mb-px flex space-x-8'>
                <Button
                  onClick={() => setActiveTab('products')}
                  hasTransition
                  hasFontMedium
                  hasTextSm
                  className={`py-2 px-1 border-b-2 ${
                    activeTab === 'products'
                      ? 'border-gray-900 text-gray-900'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  상품 관리
                </Button>
                <Button
                  onClick={() => setActiveTab('coupons')}
                  hasTransition
                  hasFontMedium
                  hasTextSm
                  className={`py-2 px-1 border-b-2 ${
                    activeTab === 'coupons'
                      ? 'border-gray-900 text-gray-900'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  쿠폰 관리
                </Button>
              </nav>
            </div>

            {activeTab === 'products' ? (
              <Card
                padding='md'
                headerStyle='border'
                contentPadding={false}
                header={
                  <div className='flex justify-between items-center'>
                    <h2 className='text-lg font-semibold'>상품 목록</h2>
                    <Button
                      onClick={() => {
                        setEditingProduct('new');
                        setProductForm(defaultProductForm);
                        setShowProductForm(true);
                      }}
                      hasTextSm
                      hasRounded
                      className='px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800'
                    >
                      새 상품 추가
                    </Button>
                  </div>
                }
              >
                <div className='overflow-x-auto'>
                  <table className='w-full'>
                    <thead className='bg-gray-50 border-b border-gray-200'>
                      <tr>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          상품명
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          가격
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          재고
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          설명
                        </th>
                        <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          작업
                        </th>
                      </tr>
                    </thead>
                    <tbody className='bg-white divide-y divide-gray-200'>
                      {(activeTab === 'products' ? products : products).map((product) => (
                        <tr key={product.id} className='hover:bg-gray-50'>
                          <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                            {product.name}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                            {formatPrice(product.price, product.id, isAdmin, products, cart)}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                            <Badge
                              size='xs'
                              rounded='full'
                              className={`inline-flex items-center px-2.5 py-0.5 font-medium ${
                                product.stock > 10
                                  ? 'bg-green-100 text-green-800'
                                  : product.stock > 0
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {product.stock}개
                            </Badge>
                          </td>
                          <td className='px-6 py-4 text-sm text-gray-500 max-w-xs truncate'>
                            {product.description || '-'}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                            <Button
                              onClick={() => startEditProduct(product)}
                              className='text-indigo-600 hover:text-indigo-900 mr-3'
                            >
                              수정
                            </Button>
                            <Button
                              onClick={() => deleteProduct(product.id, addNotification)}
                              className='text-red-600 hover:text-red-900'
                            >
                              삭제
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {showProductForm && (
                  <div className='p-6 border-t border-gray-200 bg-gray-50'>
                    <form onSubmit={handleProductSubmit} className='space-y-4'>
                      <h3 className='text-lg font-medium text-gray-900'>
                        {editingProduct === 'new' ? '새 상품 추가' : '상품 수정'}
                      </h3>
                      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                        <div>
                          <Input
                            label='상품명'
                            type='text'
                            value={productForm.name}
                            onChange={(e) =>
                              setProductForm({ ...productForm, name: e.target.value })
                            }
                            required
                          />
                        </div>
                        <div>
                          <Input
                            label='설명'
                            type='text'
                            value={productForm.description}
                            onChange={(e) =>
                              setProductForm({ ...productForm, description: e.target.value })
                            }
                          />
                        </div>
                        <div>
                          <Input
                            label='가격'
                            type='text'
                            value={productForm.price === 0 ? '' : productForm.price}
                            onChange={(e) => {
                              const { value } = e.target;
                              if (value === '' || /^\d+$/.test(value)) {
                                setProductForm({
                                  ...productForm,
                                  price: value === '' ? 0 : parseInt(value),
                                });
                              }
                            }}
                            onBlur={(e) => {
                              const { value } = e.target;
                              if (value === '') {
                                setProductForm({ ...productForm, price: 0 });
                              } else if (!isValidPrice(parseInt(value))) {
                                addNotification('가격은 0보다 커야 합니다', 'error');
                                setProductForm({ ...productForm, price: 0 });
                              }
                            }}
                            placeholder='숫자만 입력'
                            required
                          />
                        </div>
                        <div>
                          <Input
                            label='재고'
                            type='text'
                            value={productForm.stock === 0 ? '' : productForm.stock}
                            onChange={(e) => {
                              const { value } = e.target;
                              if (value === '' || /^\d+$/.test(value)) {
                                setProductForm({
                                  ...productForm,
                                  stock: value === '' ? 0 : parseInt(value),
                                });
                              }
                            }}
                            onBlur={(e) => {
                              const { value } = e.target;
                              if (value === '') {
                                setProductForm({ ...productForm, stock: 0 });
                              } else if (!isValidStock(parseInt(value))) {
                                if (parseInt(value) < 0) {
                                  addNotification('재고는 0보다 커야 합니다', 'error');
                                  setProductForm({ ...productForm, stock: 0 });
                                } else {
                                  addNotification('재고는 9999개를 초과할 수 없습니다', 'error');
                                  setProductForm({ ...productForm, stock: 9999 });
                                }
                              }
                            }}
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
                              <Button
                                type='button'
                                onClick={() => {
                                  const newDiscounts = productForm.discounts.filter(
                                    (_, i) => i !== index
                                  );
                                  setProductForm({ ...productForm, discounts: newDiscounts });
                                }}
                                className='text-red-600 hover:text-red-800'
                              >
                                <CloseIcon />
                              </Button>
                            </div>
                          ))}
                          <Button
                            type='button'
                            onClick={() => {
                              setProductForm({
                                ...productForm,
                                discounts: [...productForm.discounts, { quantity: 10, rate: 0.1 }],
                              });
                            }}
                            hasTextSm
                            className='text-indigo-600 hover:text-indigo-800'
                          >
                            + 할인 추가
                          </Button>
                        </div>
                      </div>

                      <div className='flex justify-end gap-3'>
                        <Button
                          type='button'
                          onClick={() => {
                            setEditingProduct(null);
                            setProductForm(defaultProductForm);
                            setShowProductForm(false);
                          }}
                          hasTextSm
                          hasFontMedium
                          hasRounded
                          className='px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50'
                        >
                          취소
                        </Button>
                        <Button
                          type='submit'
                          hasTextSm
                          hasFontMedium
                          hasRounded
                          className='px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700'
                        >
                          {editingProduct === 'new' ? '추가' : '수정'}
                        </Button>
                      </div>
                    </form>
                  </div>
                )}
              </Card>
            ) : (
              <Card
                padding='md'
                headerStyle='border'
                contentPadding={false}
                header={<h2 className='text-lg font-semibold'>쿠폰 관리</h2>}
              >
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
                              <Badge
                                size='sm'
                                rounded='full'
                                className='inline-flex items-center px-3 py-1 font-medium bg-white text-indigo-700'
                              >
                                {formatCouponDisplay(coupon)}
                              </Badge>
                            </div>
                          </div>
                          <Button
                            onClick={() => {
                              removeCoupon(coupon.code, addNotification);
                              // 선택된 쿠폰이 삭제되면 선택 해제
                              if (selectedCoupon?.code === coupon.code) {
                                setSelectedCoupon(null);
                              }
                            }}
                            hasTransition
                            className='text-gray-400 hover:text-red-600'
                          >
                            <TrashIcon />
                          </Button>
                        </div>
                      </div>
                    ))}

                    <div className='border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center hover:border-gray-400 transition-colors'>
                      <Button
                        onClick={() => setShowCouponForm(!showCouponForm)}
                        className='text-gray-400 hover:text-gray-600 flex flex-col items-center'
                      >
                        <PlusIcon />
                        <p className='mt-2 text-sm font-medium'>새 쿠폰 추가</p>
                      </Button>
                    </div>
                  </div>

                  {showCouponForm && (
                    <div className='mt-6 p-4 bg-gray-50 rounded-lg'>
                      <form onSubmit={handleCouponSubmit} className='space-y-4'>
                        <h3 className='text-md font-medium text-gray-900'>새 쿠폰 생성</h3>
                        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
                          <div>
                            <Input
                              label='쿠폰명'
                              type='text'
                              value={couponForm.name}
                              onChange={(e) =>
                                setCouponForm({ ...couponForm, name: e.target.value })
                              }
                              className='text-sm'
                              placeholder='신규 가입 쿠폰'
                              required
                            />
                          </div>
                          <div>
                            <Input
                              label='쿠폰 코드'
                              type='text'
                              value={couponForm.code}
                              onChange={(e) =>
                                setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })
                              }
                              className='text-sm font-mono'
                              placeholder='WELCOME2024'
                              required
                            />
                          </div>
                          <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>
                              할인 타입
                            </label>
                            <Select
                              focusStyle='indigo'
                              className='shadow-sm'
                              value={couponForm.discountType}
                              onChange={(e) =>
                                setCouponForm({
                                  ...couponForm,
                                  discountType: e.target.value as 'amount' | 'percentage',
                                })
                              }
                            >
                              <option value='amount'>정액 할인</option>
                              <option value='percentage'>정률 할인</option>
                            </Select>
                          </div>
                          <div>
                            <Input
                              label={getCouponDiscountLabel(couponForm.discountType)}
                              type='text'
                              value={couponForm.discountValue === 0 ? '' : couponForm.discountValue}
                              onChange={(e) => {
                                const { value } = e.target;
                                if (value === '' || /^\d+$/.test(value)) {
                                  setCouponForm({
                                    ...couponForm,
                                    discountValue: value === '' ? 0 : parseInt(value),
                                  });
                                }
                              }}
                              onBlur={(e) => {
                                const value = parseInt(e.target.value) || 0;
                                const validation = validateCouponDiscountValue(
                                  couponForm.discountType,
                                  value
                                );

                                if (!validation.isValid) {
                                  if (validation.errorMessage) {
                                    addNotification(validation.errorMessage, 'error');
                                  }
                                  setCouponForm({
                                    ...couponForm,
                                    discountValue: validation.correctedValue || 0,
                                  });
                                }
                              }}
                              className='text-sm'
                              placeholder={getCouponDiscountPlaceholder(couponForm.discountType)}
                              required
                            />
                          </div>
                        </div>
                        <div className='flex justify-end gap-3'>
                          <Button
                            type='button'
                            onClick={() => setShowCouponForm(false)}
                            hasTextSm
                            hasFontMedium
                            hasRounded
                            className='px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50'
                          >
                            취소
                          </Button>
                          <Button
                            type='submit'
                            hasTextSm
                            hasFontMedium
                            hasRounded
                            className='px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700'
                          >
                            쿠폰 생성
                          </Button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>
        ) : (
          /* TODO: src/basic/components/CartPage.tsx로 분리 - 장바구니 페이지 (상품목록 + 장바구니) */
          <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
            <div className='lg:col-span-3'>
              {/* TODO: src/basic/components/ProductList.tsx로 분리 - 상품 목록 */}
              <ProductList
                debouncedSearchTerm={debouncedSearchTerm}
                isAdmin={isAdmin}
                products={products}
                cart={cart}
                handleAddToCart={handleAddToCart}
                getRemainingStock={getRemainingStock}
              />
            </div>

            <div className='lg:col-span-1'>
              {/* TODO: src/basic/components/Cart.tsx로 분리 - 장바구니 표시 및 결제 */}
              <Cart
                cart={cart}
                coupons={coupons}
                selectedCoupon={selectedCoupon}
                setSelectedCoupon={setSelectedCoupon}
                handleApplyCoupon={handleApplyCoupon}
                handleCompleteOrder={handleCompleteOrder}
                handleUpdateQuantity={handleUpdateQuantity}
                removeFromCart={removeFromCart}
                totals={totals}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
