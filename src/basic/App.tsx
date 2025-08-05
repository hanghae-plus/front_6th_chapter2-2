import { useState, useCallback, useEffect } from 'react';

import { CartItem, Coupon, ProductWithUI, Notification } from '../types';
import {
  CloseIcon,
  CartIcon,
  ImageIcon,
  CartHeaderIcon,
  EmptyCartIcon,
  TrashIcon,
  PlusIcon,
} from './components/icons';
import Badge from './components/ui/Badge';
import Button from './components/ui/Button';
import Card from './components/ui/Card';
import Input from './components/ui/Input';
import Select from './components/ui/Selector';
import {
  initialProducts,
  initialCoupons,
  defaultProductForm,
  defaultCouponForm,
} from './constants';
import {
  calculateItemTotal,
  calculateCartTotal,
  getRemainingStock,
  calculateOriginalPrice,
} from './models/cart';
import {
  isCouponApplicable,
  validateCouponCode,
  formatCouponDisplay,
  validateCouponDiscountValue,
  getCouponDiscountLabel,
  getCouponDiscountPlaceholder,
} from './models/coupon';
import {
  getMaxDiscountRate,
  formatDiscountDescription,
  hasDiscount,
  calculateDiscountRate,
  hasTotalDiscount,
  calculateTotalDiscountAmount,
} from './models/discount';

const App = () => {
  // ===== 상태 관리 =====
  const [products, setProducts] = useState<ProductWithUI[]>(() => {
    const saved = localStorage.getItem('products');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialProducts;
      }
    }
    return initialProducts;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('coupons');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialCoupons;
      }
    }
    return initialCoupons;
  });

  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'products' | 'coupons'>('products');
  const [showProductForm, setShowProductForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Admin
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [productForm, setProductForm] = useState(defaultProductForm);

  const [couponForm, setCouponForm] = useState(defaultCouponForm);

  // ===== UTILS: 유틸리티 함수들 =====
  // TODO: src/basic/utils/formatters.ts로 분리 - formatPrice(price: number): string
  const formatPrice = (price: number, productId?: string): string => {
    if (productId) {
      const product = products.find((p) => p.id === productId);
      if (product && getRemainingStock(product, cart) <= 0) {
        return 'SOLD OUT';
      }
    }

    if (isAdmin) {
      return `${price.toLocaleString()}원`;
    }

    return `₩${price.toLocaleString()}`;
  };

  // ===== MODELS: 순수 함수들 (UI와 관련된 로직 없음, 외부 상태에 의존하지 않음) =====
  // TODO: src/basic/models/cart.ts로 분리 - getMaxApplicableDiscount(item)
  // const getMaxApplicableDiscount = (item: CartItem): number => { ... } // 모듈로 분리됨

  // TODO: src/basic/models/cart.ts로 분리 - calculateItemTotal(item)
  // const calculateItemTotal = (item: CartItem): number => { ... } // 모듈로 분리됨

  // TODO: src/basic/models/cart.ts로 분리 - calculateCartTotal(cart, coupon)
  // const calculateCartTotal = (): { ... } // 모듈로 분리됨

  // TODO: src/basic/models/cart.ts로 분리 - getRemainingStock(product, cart)
  // const getRemainingStock = (product: Product): number => { ... } // 모듈로 분리됨

  // ===== HOOKS: 상태 관리 및 이벤트 핸들러들 =====
  // TODO: src/basic/hooks/useCart.ts로 분리 - 장바구니 상태 관리 (localStorage 연동)
  const addNotification = useCallback(
    (message: string, type: 'error' | 'success' | 'warning' = 'success') => {
      const id = Date.now().toString();
      setNotifications((prev) => [...prev, { id, message, type }]);

      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, 3000);
    },
    []
  );

  const [totalItemCount, setTotalItemCount] = useState(0);

  useEffect(() => {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    setTotalItemCount(count);
  }, [cart]);

  // TODO: src/basic/hooks/useLocalStorage.ts로 분리 - localStorage 관리
  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('coupons', JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cart));
    } else {
      localStorage.removeItem('cart');
    }
  }, [cart]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // TODO: src/basic/hooks/useCart.ts로 분리 - addToCart(product)
  const addToCart = useCallback(
    (product: ProductWithUI) => {
      const remainingStock = getRemainingStock(product, cart);
      if (remainingStock <= 0) {
        addNotification('재고가 부족합니다!', 'error');
        return;
      }

      setCart((prevCart) => {
        const existingItem = prevCart.find((item) => item.product.id === product.id);

        if (existingItem) {
          const newQuantity = existingItem.quantity + 1;

          if (newQuantity > product.stock) {
            addNotification(`재고는 ${product.stock}개까지만 있습니다.`, 'error');
            return prevCart;
          }

          return prevCart.map((item) =>
            item.product.id === product.id ? { ...item, quantity: newQuantity } : item
          );
        }

        return [...prevCart, { product, quantity: 1 }];
      });

      addNotification('장바구니에 담았습니다', 'success');
    },
    [cart, addNotification, getRemainingStock]
  );

  // TODO: src/basic/hooks/useCart.ts로 분리 - removeFromCart(productId)
  const removeFromCart = useCallback((productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  }, []);

  // TODO: src/basic/hooks/useCart.ts로 분리 - updateQuantity(productId, quantity)
  const updateQuantity = useCallback(
    (productId: string, newQuantity: number) => {
      if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
      }

      const product = products.find((p) => p.id === productId);
      if (!product) return;

      const maxStock = product.stock;
      if (newQuantity > maxStock) {
        addNotification(`재고는 ${maxStock}개까지만 있습니다.`, 'error');
        return;
      }

      setCart((prevCart) =>
        prevCart.map((item) =>
          item.product.id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    },
    [products, removeFromCart, addNotification, getRemainingStock]
  );

  // TODO: src/basic/hooks/useCart.ts로 분리 - applyCoupon(coupon)
  const applyCoupon = useCallback(
    (coupon: Coupon) => {
      const currentTotal = calculateCartTotal(cart, selectedCoupon).totalAfterDiscount;

      // TODO: src/basic/models/coupon.ts로 분리 - isCouponApplicable(coupon, cartTotal)
      if (!isCouponApplicable(coupon, currentTotal)) {
        addNotification('percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.', 'error');
        return;
      }

      setSelectedCoupon(coupon);
      addNotification('쿠폰이 적용되었습니다.', 'success');
    },
    [addNotification, calculateCartTotal]
  );

  // TODO: src/basic/hooks/useCart.ts로 분리 - completeOrder()
  const completeOrder = useCallback(() => {
    const orderNumber = `ORD-${Date.now()}`;
    addNotification(`주문이 완료되었습니다. 주문번호: ${orderNumber}`, 'success');
    setCart([]);
    setSelectedCoupon(null);
  }, [addNotification]);

  // TODO: src/basic/hooks/useProducts.ts로 분리 - addProduct(product), updateProduct(product), removeProduct(productId)
  const addProduct = useCallback(
    (newProduct: Omit<ProductWithUI, 'id'>) => {
      const product: ProductWithUI = {
        ...newProduct,
        id: `p${Date.now()}`,
      };
      setProducts((prev) => [...prev, product]);
      addNotification('상품이 추가되었습니다.', 'success');
    },
    [addNotification]
  );

  const updateProduct = useCallback(
    (productId: string, updates: Partial<ProductWithUI>) => {
      setProducts((prev) =>
        prev.map((product) => (product.id === productId ? { ...product, ...updates } : product))
      );
      addNotification('상품이 수정되었습니다.', 'success');
    },
    [addNotification]
  );

  const deleteProduct = useCallback(
    (productId: string) => {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      addNotification('상품이 삭제되었습니다.', 'success');
    },
    [addNotification]
  );

  // TODO: src/basic/hooks/useCoupons.ts로 분리 - addCoupon(coupon), removeCoupon(couponCode)
  const addCoupon = useCallback(
    (newCoupon: Coupon) => {
      if (!validateCouponCode(newCoupon.code, coupons)) {
        addNotification('이미 존재하는 쿠폰 코드입니다.', 'error');
        return;
      }
      setCoupons((prev) => [...prev, newCoupon]);
      addNotification('쿠폰이 추가되었습니다.', 'success');
    },
    [coupons, addNotification]
  );

  // TODO: src/basic/hooks/useCoupons.ts로 분리 - addCoupon(coupon), removeCoupon(couponCode)
  const deleteCoupon = useCallback(
    (couponCode: string) => {
      setCoupons((prev) => prev.filter((c) => c.code !== couponCode));
      if (selectedCoupon?.code === couponCode) {
        setSelectedCoupon(null);
      }
      addNotification('쿠폰이 삭제되었습니다.', 'success');
    },
    [selectedCoupon, addNotification]
  );

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
    setProductForm(defaultProductForm);
    setEditingProduct(null);
    setShowProductForm(false);
  };

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCoupon(couponForm);
    setCouponForm(defaultCouponForm);
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

  const filteredProducts = debouncedSearchTerm
    ? products.filter(
        (product) =>
          product.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          (product.description &&
            product.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))
      )
    : products;

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* ===== ENTITY COMPONENTS: 엔티티 컴포넌트들 ===== */}
      {/* TODO: src/basic/components/Notification.tsx로 분리 - 알림 시스템 */}
      {notifications.length > 0 && (
        <div className='fixed top-20 right-4 z-50 space-y-2 max-w-sm'>
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 rounded-md shadow-md text-white flex justify-between items-center ${
                notif.type === 'error'
                  ? 'bg-red-600'
                  : notif.type === 'warning'
                  ? 'bg-yellow-600'
                  : 'bg-green-600'
              }`}
            >
              <span className='mr-2'>{notif.message}</span>
              <Button
                onClick={() => setNotifications((prev) => prev.filter((n) => n.id !== notif.id))}
                className='text-white hover:text-gray-200'
              >
                <CloseIcon />
              </Button>
            </div>
          ))}
        </div>
      )}
      {/* TODO: src/basic/components/Header.tsx로 분리 - 헤더 (네비게이션, 검색) */}
      <header className='bg-white shadow-sm sticky top-0 z-40 border-b'>
        <div className='max-w-7xl mx-auto px-4'>
          <div className='flex justify-between items-center h-16'>
            <div className='flex items-center flex-1'>
              <h1 className='text-xl font-semibold text-gray-800'>SHOP</h1>
              {/* 검색창 - 안티패턴: 검색 로직이 컴포넌트에 직접 포함 */}
              {!isAdmin && (
                <div className='ml-8 flex-1 max-w-md'>
                  <Input
                    type='text'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder='상품 검색...'
                    className='px-4 py-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500'
                  />
                </div>
              )}
            </div>
            <nav className='flex items-center space-x-4'>
              <Button
                onClick={() => setIsAdmin(!isAdmin)}
                hasTransition
                hasTextSm
                hasRounded
                className={`px-3 py-1.5 ${
                  isAdmin ? 'bg-gray-800 text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {isAdmin ? '쇼핑몰로 돌아가기' : '관리자 페이지로'}
              </Button>
              {!isAdmin && (
                <div className='relative'>
                  <CartIcon />
                  {cart.length > 0 && (
                    <span className='absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center'>
                      {totalItemCount}
                    </span>
                  )}
                </div>
              )}
            </nav>
          </div>
        </div>
      </header>

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
                            {formatPrice(product.price, product.id)}
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
                              onClick={() => deleteProduct(product.id)}
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
                              // TODO: src/basic/utils/validators.ts로 분리 - isValidPrice(price: number)
                              if (value === '') {
                                setProductForm({ ...productForm, price: 0 });
                              } else if (parseInt(value) < 0) {
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
                              // TODO: src/basic/utils/validators.ts로 분리 - isValidStock(stock: number)
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
                            onClick={() => deleteCoupon(coupon.code)}
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
              <section>
                <div className='mb-6 flex justify-between items-center'>
                  <h2 className='text-2xl font-semibold text-gray-800'>전체 상품</h2>
                  <div className='text-sm text-gray-600'>총 {products.length}개 상품</div>
                </div>
                {filteredProducts.length === 0 ? (
                  <div className='text-center py-12'>
                    <p className='text-gray-500'>
                      "{debouncedSearchTerm}"에 대한 검색 결과가 없습니다.
                    </p>
                  </div>
                ) : (
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {filteredProducts.map((product) => {
                      const remainingStock = getRemainingStock(product, cart);

                      return (
                        // TODO: src/basic/components/ProductCard.tsx로 분리 - 개별 상품 카드
                        <Card
                          key={product.id}
                          padding='none'
                          className='overflow-hidden hover:shadow-lg transition-shadow'
                        >
                          {/* 상품 이미지 영역 (placeholder) */}
                          <div className='relative'>
                            <div className='aspect-square bg-gray-100 flex items-center justify-center'>
                              <ImageIcon />
                            </div>
                            {product.isRecommended && (
                              <Badge
                                size='xs'
                                rounded='sm'
                                className='absolute top-2 right-2 bg-red-500 text-white px-2 py-1'
                              >
                                BEST
                              </Badge>
                            )}
                            {product.discounts.length > 0 && (
                              <Badge
                                size='xs'
                                rounded='sm'
                                className='absolute top-2 left-2 bg-orange-500 text-white px-2 py-1'
                              >
                                {/* TODO: src/basic/models/discount.ts로 분리 - getMaxDiscountRate(discounts): number */}
                                ~{getMaxDiscountRate(product.discounts)}%
                              </Badge>
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
                                {formatPrice(product.price, product.id)}
                              </p>
                              {product.discounts.length > 0 && (
                                <p className='text-xs text-gray-500'>
                                  {formatDiscountDescription(product.discounts)}
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
                              onClick={() => addToCart(product)}
                              disabled={remainingStock <= 0}
                              hasFontMedium
                              hasTransition
                              hasRounded
                              className={`w-full py-2 px-4 rounded-md ${
                                remainingStock <= 0
                                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                  : 'bg-gray-900 text-white hover:bg-gray-800'
                              }`}
                            >
                              {remainingStock <= 0 ? '품절' : '장바구니 담기'}
                            </Button>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </section>
            </div>

            <div className='lg:col-span-1'>
              {/* TODO: src/basic/components/Cart.tsx로 분리 - 장바구니 표시 및 결제 */}
              <div className='sticky top-24 space-y-4'>
                <Card
                  padding='sm'
                  headerStyle='margin'
                  header={
                    <h2 className='text-lg font-semibold mb-4 flex items-center'>
                      <CartHeaderIcon />
                      장바구니
                    </h2>
                  }
                >
                  {cart.length === 0 ? (
                    <div className='text-center py-8'>
                      <EmptyCartIcon />
                      <p className='text-gray-500 text-sm'>장바구니가 비어있습니다</p>
                    </div>
                  ) : (
                    <div className='space-y-3'>
                      {cart.map((item) => {
                        const itemTotal = calculateItemTotal(item, cart);
                        const originalPrice = calculateOriginalPrice(item);
                        const hasDiscountValue = hasDiscount(itemTotal, originalPrice);
                        const discountRate = calculateDiscountRate(itemTotal, originalPrice);

                        return (
                          <div key={item.product.id} className='border-b pb-3 last:border-b-0'>
                            <div className='flex justify-between items-start mb-2'>
                              <h4 className='text-sm font-medium text-gray-900 flex-1'>
                                {item.product.name}
                              </h4>
                              <Button
                                onClick={() => removeFromCart(item.product.id)}
                                className='text-gray-400 hover:text-red-500 ml-2'
                              >
                                <CloseIcon />
                              </Button>
                            </div>
                            <div className='flex items-center justify-between'>
                              <div className='flex items-center'>
                                <Button
                                  onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                  hasRounded
                                  className='w-6 h-6 border border-gray-300 flex items-center justify-center hover:bg-gray-100'
                                >
                                  <span className='text-xs'>−</span>
                                </Button>
                                <span className='mx-3 text-sm font-medium w-8 text-center'>
                                  {item.quantity}
                                </span>
                                <Button
                                  onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                  hasRounded
                                  className='w-6 h-6 border border-gray-300 flex items-center justify-center hover:bg-gray-100'
                                >
                                  <span className='text-xs'>+</span>
                                </Button>
                              </div>
                              <div className='text-right'>
                                {hasDiscountValue && (
                                  <Badge
                                    size='xs'
                                    rounded='none'
                                    className='text-red-500 font-medium block'
                                  >
                                    -{discountRate}%
                                  </Badge>
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
                </Card>

                {cart.length > 0 && (
                  <>
                    <Card
                      padding='sm'
                      headerStyle='margin'
                      header={
                        <div className='flex items-center justify-between mb-3'>
                          <h3 className='text-sm font-semibold text-gray-700'>쿠폰 할인</h3>
                          <Button className='text-xs text-blue-600 hover:underline'>
                            쿠폰 등록
                          </Button>
                        </div>
                      }
                    >
                      {coupons.length > 0 && (
                        <Select
                          focusStyle='blue'
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
                        </Select>
                      )}
                    </Card>

                    <Card
                      padding='sm'
                      headerStyle='margin'
                      header={<h3 className='text-lg font-semibold mb-4'>결제 정보</h3>}
                    >
                      <div className='space-y-2 text-sm'>
                        <div className='flex justify-between'>
                          <span className='text-gray-600'>상품 금액</span>
                          <span className='font-medium'>
                            {totals.totalBeforeDiscount.toLocaleString()}원
                          </span>
                        </div>
                        {hasTotalDiscount(
                          totals.totalBeforeDiscount,
                          totals.totalAfterDiscount
                        ) && (
                          <div className='flex justify-between text-red-500'>
                            <span>할인 금액</span>
                            <span>
                              -
                              {calculateTotalDiscountAmount(
                                totals.totalBeforeDiscount,
                                totals.totalAfterDiscount
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

                      <Button
                        onClick={completeOrder}
                        hasFontMedium
                        hasTransition
                        hasRounded
                        className='w-full mt-4 py-3 bg-yellow-400 text-gray-900 rounded-md hover:bg-yellow-500'
                      >
                        {totals.totalAfterDiscount.toLocaleString()}원 결제하기
                      </Button>

                      <div className='mt-3 text-xs text-gray-500 text-center'>
                        <p>* 실제 결제는 이루어지지 않습니다</p>
                      </div>
                    </Card>
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
