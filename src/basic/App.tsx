import { useState, useCallback, useEffect } from 'react';

import { Product } from '../types';
import { AdminPage } from './components/AdminPage';
import { CartPage } from './components/CartPage';
import { Header } from './components/Header';
import { NotificationPanel } from './components/NotificationPanel';
import { useCart } from './hooks/useCart';
import { useCoupons } from './hooks/useCoupons';
import { useProducts } from './hooks/useProducts';

interface ProductWithUI extends Product {
  description?: string;
  isRecommended?: boolean;
}

interface Notification {
  id: string;
  message: string;
  type: 'error' | 'success' | 'warning';
}

const App = () => {
  const addNotification = useCallback(
    (message: string, type: 'error' | 'success' | 'warning' = 'success') => {
      const id = Date.now().toString();
      setNotifications((prev) => [...prev, { id, message, type }]);

      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, 3000);
    },
    [],
  );
  const { products, addProduct, updateProduct, deleteProduct } = useProducts({ addNotification });

  const {
    cart,
    selectedCoupon,
    setSelectedCoupon,
    totalItemCount,
    setTotalItemCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    calculateItemTotal,
    calculateCartTotal,
    getRemainingStock,
    clearCart,
  } = useCart({ products, addNotification });

  const { coupons, addCoupon, deleteCoupon } = useCoupons({
    selectedCoupon,
    setSelectedCoupon,
    addNotification,
  });

  const [isAdmin, setIsAdmin] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'products' | 'coupons'>('products');
  const [showProductForm, setShowProductForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

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

  const formatPrice = (price: number, productId?: string): string => {
    if (productId) {
      const product = products.find((p) => p.id === productId);
      if (product && getRemainingStock(product) <= 0) {
        return 'SOLD OUT';
      }
    }
    if (isAdmin) {
      return `${price.toLocaleString()}원`;
    }

    return `₩${price.toLocaleString()}`;
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const completeOrder = useCallback(() => {
    const orderNumber = `ORD-${Date.now()}`;
    addNotification(`주문이 완료되었습니다. 주문번호: ${orderNumber}`, 'success');
    clearCart();
  }, [addNotification]);

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

  const totals = calculateCartTotal();

  const filteredProducts = debouncedSearchTerm
    ? products.filter(
        (product) =>
          product.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          (product.description &&
            product.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase())),
      )
    : products;

  return (
    <div className='min-h-screen bg-gray-50'>
      <NotificationPanel notifications={notifications} setNotifications={setNotifications} />
      <Header
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        cart={cart}
        totalItemCount={totalItemCount}
      />
      <main className='max-w-7xl mx-auto px-4 py-8'>
        {isAdmin ? (
          <AdminPage
            // --- 탭 관련 상태 ---
            activeTab={activeTab}
            // --- 데이터 엔티티 ---
            products={products}
            coupons={coupons}
            // --- UI 및 form 관련 상태 ---
            editingProduct={editingProduct}
            showProductForm={showProductForm}
            productForm={productForm}
            showCouponForm={showCouponForm}
            couponForm={couponForm}
            // --- 탭 관련 핸들러 ---
            setActiveTab={setActiveTab}
            // --- 상품 관련 핸들러 ---
            deleteProduct={deleteProduct}
            startEditProduct={startEditProduct}
            handleProductSubmit={handleProductSubmit}
            // --- 쿠폰 관련 핸들러 ---
            deleteCoupon={deleteCoupon}
            handleCouponSubmit={handleCouponSubmit}
            // --- form 관련 상태 변경 함수 ---
            setEditingProduct={setEditingProduct}
            setShowProductForm={setShowProductForm}
            setProductForm={setProductForm}
            setShowCouponForm={setShowCouponForm}
            setCouponForm={setCouponForm}
            // --- 유틸 함수 ---
            formatPrice={formatPrice}
            addNotification={addNotification}
          />
        ) : (
          <CartPage
            // --- 데이터 엔티티 ---
            products={products}
            cart={cart}
            coupons={coupons}
            // --- 파생 데이터 ---
            filteredProducts={filteredProducts}
            totals={totals}
            // --- UI 상태 ---
            selectedCoupon={selectedCoupon}
            debouncedSearchTerm={debouncedSearchTerm}
            // --- 장바구니 관련 핸들러 ---
            addToCart={addToCart}
            removeFromCart={removeFromCart}
            updateQuantity={updateQuantity}
            // --- 쿠폰 관련 핸들러 ---
            applyCoupon={applyCoupon}
            setSelectedCoupon={setSelectedCoupon}
            // --- 주문 관련 핸들러 ---
            completeOrder={completeOrder}
            // --- 계산 및 포맷팅 유틸 함수 ---
            getRemainingStock={getRemainingStock}
            calculateItemTotal={calculateItemTotal}
            formatPrice={formatPrice}
          />
        )}
      </main>
    </div>
  );
};

export default App;
