import { useState, useCallback, useEffect } from 'react';
import {  Coupon, Product } from '../types';
import { useCart } from './hooks/useCart';
import { useProducts } from './hooks/useProducts';
import { useCoupons } from './hooks/useCoupons';
import { useDebounce } from './hooks/useDebounce';
import ProductCard from './components/ProductCard';
import CartItem from './components/CartItem';
import CartSummary from './components/CartSummary';
import AdminProductTable from './components/admin/AdminProductTable';
import AdminCouponCard from './components/admin/AdminCouponCard';
import AdminCouponForm from './components/admin/AdminCouponForm';
import AdminProductForm from './components/admin/AdminProductForm';
import CouponSelect from './components/CouponSelect';
import { calculateCartTotal, calculateItemTotal } from './utils/cart';

interface ProductWithUI extends Product {
  description?: string;
  isRecommended?: boolean;
}

interface Notification {
  id: string;
  message: string;
  type: 'error' | 'success' | 'warning';
}


/*  {
    id: 'p1',
    name: '상품1',
    price: 10000,
    stock: 20,
    discounts: [
      { quantity: 10, rate: 0.1 },
      { quantity: 20, rate: 0.2 }
    ],
    description: '최고급 품질의 프리미엄 상품입니다.'
  },
  {
    id: 'p2',
    name: '상품2',
    price: 20000,
    stock: 20,
    discounts: [
      { quantity: 10, rate: 0.15 }
    ],
    description: '다양한 기능을 갖춘 실용적인 상품입니다.',
    isRecommended: true
  },
  {
    id: 'p3',
    name: '상품3',
    price: 30000,
    stock: 20,
    discounts: [
      { quantity: 10, rate: 0.2 },
      { quantity: 30, rate: 0.25 }
    ],
    description: '대용량과 고성능을 자랑하는 상품입니다.'
  }
];


  {
    name: '5000원 할인',
    code: 'AMOUNT5000',
    discountType: 'amount',
    discountValue: 5000
  },
  {
    name: '10% 할인',
    code: 'PERCENT10',
    discountType: 'percentage',
    discountValue: 10
  }
];*/

const App = () => {

  const { products, addProduct: addProductHook, updateProduct: updateProductHook, deleteProduct: deleteProductHook } = useProducts();



  const { cart, addToCart: addToCartHook, removeFromCart: removeFromCartHook, updateQuantity: updateQuantityHook, calculateTotal, clearCart, getRemainingStock } = useCart();

  const { coupons, addCoupon: addCouponHook, deleteCoupon: deleteCouponHook } = useCoupons();



  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'products' | 'coupons'>('products');
  const [showProductForm, setShowProductForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Admin
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    price: 0,
    stock: 0,
    description: '',
    discounts: [] as Array<{ quantity: number; rate: number }>
  });

  const [couponForm, setCouponForm] = useState({
    name: '',
    code: '',
    discountType: 'amount' as 'amount' | 'percentage',
    discountValue: 0
  });


  const formatPrice = (price: number, productId?: string): string => {
    if (productId) {
      const product = products.find(p => p.id === productId);
      if (product && getRemainingStock(product) <= 0) {
        return 'SOLD OUT';
      }
    }

    if (isAdmin) {
      return `${price.toLocaleString()}원`;
    }
    
    return `₩${price.toLocaleString()}`;
  };









  const addNotification = useCallback((message: string, type: 'error' | 'success' | 'warning' = 'success') => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  }, []);

  const [totalItemCount, setTotalItemCount] = useState(0);
  

  useEffect(() => {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    setTotalItemCount(count);
  }, [cart]);









  const addToCart = useCallback((product: ProductWithUI) => {
    const res = addToCartHook(product);
    if (res.success) {
      addNotification('장바구니에 담았습니다', 'success');
    } else {
      addNotification(res.message ?? '재고가 부족합니다!', 'error');
    }
  }, [addToCartHook, addNotification]);

  const removeFromCart = useCallback((productId: string) => {
    removeFromCartHook(productId);
  }, [removeFromCartHook]);

  const updateQuantity = useCallback((productId: string, newQuantity: number) => {
    const res = updateQuantityHook(productId, newQuantity);
    if (!res.success) {
      addNotification(res.message ?? '수량 변경 실패', 'error');
    }
  }, [updateQuantityHook, addNotification]);

  const applyCoupon = useCallback((coupon: Coupon) => {
    const currentTotal = calculateTotal().totalAfterDiscount;
    
    if (currentTotal < 10000 && coupon.discountType === 'percentage') {
      addNotification('percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.', 'error');
      return;
    }

    setSelectedCoupon(coupon);
    addNotification('쿠폰이 적용되었습니다.', 'success');
  }, [addNotification, calculateCartTotal]);

  const completeOrder = useCallback(() => {
    const orderNumber = `ORD-${Date.now()}`;
    addNotification(`주문이 완료되었습니다. 주문번호: ${orderNumber}`, 'success');
    clearCart();
    setSelectedCoupon(null);
  }, [addNotification]);

  const addProduct = useCallback((newProduct: Omit<ProductWithUI, 'id'>) => {
    const res = addProductHook(newProduct);
    if (res.success) {
      addNotification('상품이 추가되었습니다.', 'success');
    } else {
      addNotification(res.message ?? '상품 추가 실패', 'error');
    }
  }, [addProductHook, addNotification]);

  const updateProduct = useCallback((productId: string, updates: Partial<ProductWithUI>) => {
    const res = updateProductHook(productId, updates);
    if (res.success) {
      addNotification('상품이 수정되었습니다.', 'success');
    } else {
      addNotification(res.message ?? '상품 수정 실패', 'error');
    }
  }, [updateProductHook, addNotification]);

  const deleteProduct = useCallback((productId: string) => {
    deleteProductHook(productId);
    addNotification('상품이 삭제되었습니다.', 'success');
  }, [deleteProductHook, addNotification]);

  const addCoupon = useCallback((newCoupon: Coupon) => {
    const res = addCouponHook(newCoupon);
    if (res.success) {
      addNotification('쿠폰이 추가되었습니다.', 'success');
    } else {
      addNotification(res.message ?? '쿠폰 생성 실패', 'error');
    }
  }, [addCouponHook, addNotification]);

  const deleteCoupon = useCallback((couponCode: string) => {
    deleteCouponHook(couponCode);
    if (selectedCoupon?.code === couponCode) {
      setSelectedCoupon(null);
    }
    addNotification('쿠폰이 삭제되었습니다.', 'success');
  }, [deleteCouponHook, selectedCoupon, addNotification]);

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct && editingProduct !== 'new') {
      updateProduct(editingProduct, productForm);
      setEditingProduct(null);
    } else {
      addProduct({
        ...productForm,
        discounts: productForm.discounts
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
      discountValue: 0
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
      discounts: product.discounts || []
    });
    setShowProductForm(true);
  };

  const totals = calculateTotal(selectedCoupon);

  const filteredProducts = debouncedSearchTerm
    ? products.filter(product => 
        product.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))
      )
    : products;

  return (
    <div className="min-h-screen bg-gray-50">
      {notifications.length > 0 && (
        <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
          {notifications.map(notif => (
            <div
              key={notif.id}
              className={`p-4 rounded-md shadow-md text-white flex justify-between items-center ${
                notif.type === 'error' ? 'bg-red-600' : 
                notif.type === 'warning' ? 'bg-yellow-600' : 
                'bg-green-600'
              }`}
            >
              <span className="mr-2">{notif.message}</span>
              <button 
                onClick={() => setNotifications(prev => prev.filter(n => n.id !== notif.id))}
                className="text-white hover:text-gray-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
      <header className="bg-white shadow-sm sticky top-0 z-40 border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center flex-1">
              <h1 className="text-xl font-semibold text-gray-800">SHOP</h1>
              {/* 검색창 - 안티패턴: 검색 로직이 컴포넌트에 직접 포함 */}
              {!isAdmin && (
                <div className="ml-8 flex-1 max-w-md">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="상품 검색..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              )}
            </div>
            <nav className="flex items-center space-x-4">
              <button
                onClick={() => setIsAdmin(!isAdmin)}
                className={`px-3 py-1.5 text-sm rounded transition-colors ${
                  isAdmin 
                    ? 'bg-gray-800 text-white' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {isAdmin ? '쇼핑몰로 돌아가기' : '관리자 페이지로'}
              </button>
              {!isAdmin && (
                <div className="relative">
                  <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {cart.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {totalItemCount}
                    </span>
                  )}
                </div>
              )}
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? (
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">관리자 대시보드</h1>
              <p className="text-gray-600 mt-1">상품과 쿠폰을 관리할 수 있습니다</p>
            </div>
            <div className="border-b border-gray-200 mb-6">
              <nav className="-mb-px flex space-x-8">
                <button 
                  onClick={() => setActiveTab('products')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'products' 
                      ? 'border-gray-900 text-gray-900' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  상품 관리
                </button>
                <button 
                  onClick={() => setActiveTab('coupons')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'coupons' 
                      ? 'border-gray-900 text-gray-900' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  쿠폰 관리
                </button>
              </nav>
            </div>

            {activeTab === 'products' ? (
              <section className="bg-white rounded-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold">상품 목록</h2>
                  <button
                    onClick={() => {
                      setEditingProduct('new');
                      setProductForm({ name: '', price: 0, stock: 0, description: '', discounts: [] });
                      setShowProductForm(true);
                    }}
                    className="px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800"
                  >
                    새 상품 추가
                  </button>
                </div>
              </div>

              <AdminProductTable
  products={products}
  formatPrice={formatPrice}
  onEdit={startEditProduct}
  onDelete={deleteProduct}
/>
{showProductForm && (
  <AdminProductForm
    mode={editingProduct === 'new' ? 'create' : 'edit'}
    productForm={productForm}
    setProductForm={setProductForm}
    onSubmit={handleProductSubmit}
    onCancel={() => {
      setEditingProduct(null);
      setProductForm({ name: '', price: 0, stock: 0, description: '', discounts: [] });
      setShowProductForm(false);
    }}
    addNotification={addNotification}
  />
)}
              </section>
            ) : (
              <section className="bg-white rounded-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold">쿠폰 관리</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {coupons.map(c => (
  <AdminCouponCard
    key={c.code}
    coupon={c}
    onDelete={deleteCoupon}
/>
))}

                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center hover:border-gray-400 transition-colors">
                    <button
                      onClick={() => setShowCouponForm(!showCouponForm)}
                      className="text-gray-400 hover:text-gray-600 flex flex-col items-center"
                    >
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      <p className="mt-2 text-sm font-medium">새 쿠폰 추가</p>
                    </button>
                  </div>
                </div>

                {showCouponForm && (
  <AdminCouponForm
    couponForm={couponForm}
    setCouponForm={setCouponForm}
    onSubmit={handleCouponSubmit}
    onCancel={() => setShowCouponForm(false)}
    addNotification={addNotification}
/>
)}
              </div>
              </section>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              {/* 상품 목록 */}
              <section>
                <div className="mb-6 flex justify-between items-center">
                  <h2 className="text-2xl font-semibold text-gray-800">전체 상품</h2>
                  <div className="text-sm text-gray-600">
                    총 {products.length}개 상품
                  </div>
                </div>
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">"{debouncedSearchTerm}"에 대한 검색 결과가 없습니다.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredProducts.map(product => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        remainingStock={getRemainingStock(product)}
                        onAddToCart={addToCart}
                        formatPrice={formatPrice}
                      />
                    ))}
                  </div>
                )}
              </section>
            </div>
            
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-4">
                <section className="bg-white rounded-lg border border-gray-200 p-4">
                  <h2 className="text-lg font-semibold mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    장바구니
                  </h2>
                  {cart.length === 0 ? (
                    <div className="text-center py-8">
                      <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      <p className="text-gray-500 text-sm">장바구니가 비어있습니다</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {cart.map(item => {
                        const itemTotal = calculateItemTotal(item, cart);
                        const originalPrice = item.product.price * item.quantity;
                        const hasDiscount = itemTotal < originalPrice;
                        const discountRate = hasDiscount ? Math.round((1 - itemTotal / originalPrice) * 100) : 0;
                        
                        return (
                          <CartItem
                            key={item.product.id}
                            item={item}
                            itemTotal={itemTotal}
                            hasDiscount={hasDiscount}
                            discountRate={discountRate}
                            updateQuantity={updateQuantity}
                            removeFromCart={removeFromCart}
                          />
                        );
                      })}
                    </div>
                  )}
                </section>

                {cart.length > 0 && (
                  <>
                    <CouponSelect
  coupons={coupons}
  selectedCoupon={selectedCoupon}
  onSelect={(cp) => {
    if (cp) applyCoupon(cp);
    else setSelectedCoupon(null);
  }}
/>

<CartSummary totals={totals} onCompleteOrder={completeOrder} />
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