import { useAtom, useAtomValue } from 'jotai';

import { isAdminAtom, activeTabAtom, debouncedSearchTermAtom } from './atoms/uiAtoms';
import { AdminPage } from './components/AdminPage';
import { CartPage } from './components/CartList';
import { Header } from './components/Header';
import { ProductCardList } from './components/ProductCardList';
import { Toast } from './components/Toast';
import { useCouponForm } from './hooks/form/useCouponForm';
import { useProductForm } from './hooks/form/useProductForm';
import { useCart } from './hooks/useCart';
import { useCoupon } from './hooks/useCoupon';
import { useNotification } from './hooks/useNotification';
import { useOrder } from './hooks/useOrder';
import { useProducts } from './hooks/useProducts';
import { formatPrice } from './utils/formatters';

const App = () => {
  // UI atoms 사용
  const [isAdmin] = useAtom(isAdminAtom);
  const [activeTab, setActiveTab] = useAtom(activeTabAtom);
  const debouncedSearchTerm = useAtomValue(debouncedSearchTermAtom);

  const { addNotification } = useNotification();
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const {
    getRemainingStock,
    updateQuantity,
    addToCart,
    removeFromCart,
    calculateTotal,
    applyCoupon,
    cart,
    selectedCoupon,
  } = useCart();

  const { coupons, addCoupon, deleteCoupon } = useCoupon();

  const {
    productForm,
    showProductForm,
    editingProduct,
    handleProductFormSubmit,
    startEditProduct,
    handleCancelProduct,
    resetEditingProduct,
    updateProductForm,
    updateShowProductForm,
  } = useProductForm();

  const {
    couponForm,
    showCouponForm,
    handleCouponFormSubmit,
    updateCouponForm,
    updateShowCouponForm,
  } = useCouponForm();

  const { completeOrder } = useOrder();

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

  const totals = calculateTotal;

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
      <Toast />

      <Header />
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
