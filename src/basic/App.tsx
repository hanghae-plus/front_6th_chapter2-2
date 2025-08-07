import { useState, useCallback, useEffect } from 'react';

import { Header } from './components/Header';
import { Toast } from './components/Toast';
import { AdminPage } from './components/AdminPage';
import { CartPage } from './components/CartList';
import { ProductCardList } from './components/ProductCardList';
import { initialProducts, initialCoupons } from './constants';
import { ProductWithUI, Notification, CartItem, Coupon, Product } from './types';
import { useCart } from './hooks/useCart';
import { useNotification } from './hooks/useNotification';
import { useCoupon } from './hooks/useCoupon';
import { useProducts } from './hooks/useProducts';
import { useCouponForm } from './hooks/form/useCouponForm';
import { useProductForm } from './hooks/form/useProductForm';
import { useSearch } from './hooks/useSearch';
import { useOrder } from './hooks/useOrder';
import { formatPrice } from './utils/formatters';

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState<'products' | 'coupons'>('products');

  const { addNotification, notifications, removeNotification } = useNotification();
  const { products, addProduct, updateProduct, deleteProduct } = useProducts(addNotification);
  const {
    getRemainingStock,
    updateQuantity,
    addToCart,
    removeFromCart,
    calculateTotal,
    clearCart,
    applyCoupon,
    cart,
    selectedCoupon,
    totalItemCount,
  } = useCart(products, addNotification);
  const { coupons, addCoupon, deleteCoupon } = useCoupon(selectedCoupon, addNotification);
  const {
    couponForm,
    showCouponForm,
    handleCouponFormSubmit,
    updateCouponForm,
    updateShowCouponForm,
  } = useCouponForm();
  const {
    productForm,
    showProductForm,
    editingProduct,
    handleProductFormSubmit,
    startEditProduct,
    resetEditingProduct,
    updateProductForm,
    updateShowProductForm,
    handleCancelProduct,
  } = useProductForm();

  const { searchTerm, debouncedSearchTerm, setSearchTermValue } = useSearch();
  const { completeOrder } = useOrder({
    addNotification,
    clearCart,
    applyCoupon,
  });

  // UI에 관련된 함수같다!
  const getDisplayPrice = (price: number, productId?: string): string => {
    if (productId) {
      const product = products.find((p) => p.id === productId);
      if (product && getRemainingStock(product) <= 0) {
        return 'SOLD OUT';
      }
    }
    return formatPrice(price, isAdmin);
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct && editingProduct !== 'new') {
      updateProduct(editingProduct, productForm);
    } else {
      addProduct({
        ...productForm,
        discounts: productForm.discounts,
      });
    }
    handleProductFormSubmit();
    resetEditingProduct();
  };

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCoupon(couponForm);
    handleCouponFormSubmit();
  };

  const totals = calculateTotal();

  const filteredProducts = debouncedSearchTerm
    ? products.filter(
        (product) =>
          product.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          (product.description &&
            product.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase())),
      )
    : products;

  const handleAddProduct = () => {
    startEditProduct('new');
    updateProductForm({
      name: '',
      price: 0,
      stock: 0,
      description: '',
      discounts: [],
    });
    updateShowProductForm(true);
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <Toast notifications={notifications} onRemove={removeNotification} />

      <Header
        isAdmin={isAdmin}
        searchTerm={searchTerm}
        cart={cart}
        totalItemCount={totalItemCount}
        setSearchTerm={setSearchTermValue}
        setIsAdmin={setIsAdmin}
      />
      <main className='max-w-7xl mx-auto px-4 py-8'>
        {isAdmin ? (
          <AdminPage
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            products={products}
            coupons={coupons}
            getDisplayPrice={getDisplayPrice}
            startEditProduct={startEditProduct}
            deleteProduct={deleteProduct}
            deleteCoupon={deleteCoupon}
            showProductForm={showProductForm}
            productForm={productForm}
            editingProduct={editingProduct}
            handleProductSubmit={handleProductSubmit}
            updateProductForm={updateProductForm}
            handleCancelProduct={handleCancelProduct}
            addNotification={addNotification}
            showCouponForm={showCouponForm}
            updateShowCouponForm={updateShowCouponForm}
            couponForm={couponForm}
            handleCouponSubmit={handleCouponSubmit}
            updateCouponForm={updateCouponForm}
            handleAddProduct={handleAddProduct}
          />
        ) : (
          <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
            <ProductCardList
              products={products}
              filteredProducts={filteredProducts}
              debouncedSearchTerm={debouncedSearchTerm}
              getRemainingStock={getRemainingStock}
              getDisplayPrice={getDisplayPrice}
              addToCart={addToCart}
            />

            <CartPage
              cart={cart}
              selectedCoupon={selectedCoupon}
              coupons={coupons}
              totals={totals}
              removeFromCart={removeFromCart}
              updateQuantity={updateQuantity}
              applyCoupon={applyCoupon}
              completeOrder={completeOrder}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
