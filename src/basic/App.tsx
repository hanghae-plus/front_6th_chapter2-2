import { useState, useCallback, useEffect } from 'react';
import { CartItem, Coupon, Product } from '../types';
import { ProductWithUI } from './constants/mocks';
import {
  AdminDashboard,
  Cart,
  Coupons,
  Header,
  NotificationItem,
  Payments,
  ProductList,
} from './ui';
import { useCoupons } from './entities/coupons';
import { useProducts } from './entities/products';
import {
  formatPriceWithStock,
  calculateItemTotal,
  calculateCartTotal,
  getRemainingStock,
  filterProducts,
  validateCouponApplication,
  validateCouponCode,
} from './utils';
import {
  useCart,
  useDebounceValue,
  useLocalStorage,
  useNotifications,
  useTotalItemCount,
} from './hooks';

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const { notifications, addNotification, removeNotification } = useNotifications();
  const {
    products,
    setProducts,
    productForm,
    editingProduct,
    showProductForm,
    setShowProductForm,
    setEditingProduct,
    setProductForm,
  } = useProducts();
  const {
    coupons,
    setCoupons,
    selectedCoupon,
    setSelectedCoupon,
    showCouponForm,
    setShowCouponForm,
    couponForm,
    setCouponForm,
  } = useCoupons();
  const { cart, addToCart, removeFromCart, updateQuantity, completeOrder, getStock } = useCart({
    products,
    addNotification,
    setSelectedCoupon,
  });
  const totalItemCount = useTotalItemCount(cart);
  const [searchTerm, setSearchTerm] = useState('');

  const debouncedSearchTerm = useDebounceValue(searchTerm, 500);

  const formatPrice = useCallback(
    (price: number, productId?: string): string => {
      if (productId) {
        return formatPriceWithStock(price, productId, products, cart, isAdmin);
      }

      if (isAdmin) {
        return `${price.toLocaleString()}원`;
      }

      return `₩${price.toLocaleString()}`;
    },
    [products, cart, isAdmin]
  );

  const applyCoupon = useCallback(
    (coupon: Coupon) => {
      const currentTotal = calculateCartTotal(cart, selectedCoupon).totalAfterDiscount;
      const validation = validateCouponApplication(coupon, currentTotal);

      if (!validation.isValid) {
        addNotification(validation.errorMessage!, 'error');
        return;
      }

      setSelectedCoupon(coupon);
      addNotification('쿠폰이 적용되었습니다.', 'success');
    },
    [addNotification, cart, selectedCoupon]
  );

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

  const addCoupon = useCallback(
    (newCoupon: Coupon) => {
      const validation = validateCouponCode(newCoupon.code, coupons);
      if (!validation.isValid) {
        addNotification(validation.errorMessage!, 'error');
        return;
      }
      setCoupons((prev) => [...prev, newCoupon]);
      addNotification('쿠폰이 추가되었습니다.', 'success');
    },
    [coupons, addNotification]
  );

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
    setProductForm({
      name: '',
      price: 0,
      stock: 0,
      description: '',
      discounts: [],
    });
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
      {/* Notification */}
      {notifications.length > 0 && (
        <div className='fixed top-20 right-4 z-50 space-y-2 max-w-sm'>
          {notifications.map((notif) => (
            <NotificationItem
              key={notif.id}
              notif={notif}
              onClose={() => removeNotification(notif.id)}
            />
          ))}
        </div>
      )}
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
          // Admin Dashboard
          <AdminDashboard
            products={products}
            coupons={coupons}
            formatPrice={formatPrice}
            productForm={productForm}
            showProductForm={showProductForm}
            couponForm={couponForm}
            showCouponForm={showCouponForm}
            setProductForm={setProductForm}
            setShowProductForm={setShowProductForm}
            setCouponForm={setCouponForm}
            setShowCouponForm={setShowCouponForm}
            addNotification={addNotification}
            startEditProduct={startEditProduct}
            deleteProduct={deleteProduct}
            handleProductSubmit={handleProductSubmit}
            deleteCoupon={deleteCoupon}
            handleCouponSubmit={handleCouponSubmit}
          />
        ) : (
          <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
            <div className='lg:col-span-3'>
              {/* 상품 목록 */}
              <ProductList
                products={products}
                filteredProducts={filteredProducts}
                debouncedSearchTerm={debouncedSearchTerm}
                getRemainingStock={getStock}
                formatPrice={formatPrice}
                addToCart={addToCart}
              />
            </div>

            <div className='lg:col-span-1'>
              <div className='sticky top-24 space-y-4'>
                {/* Cart */}
                <Cart
                  cart={cart}
                  calculateItemTotal={(item) => calculateItemTotal(item, cart)}
                  removeFromCart={removeFromCart}
                  updateQuantity={updateQuantity}
                />

                {cart.length > 0 && (
                  <>
                    <Coupons
                      coupons={coupons}
                      selectedCoupon={selectedCoupon}
                      applyCoupon={applyCoupon}
                      setSelectedCoupon={setSelectedCoupon}
                    />
                    {/* Payment */}
                    <Payments totals={totals} completeOrder={completeOrder} />
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
