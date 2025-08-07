import { useState } from "react";
import { Coupon } from "../types";
import Header from "./components/layout/Header";
import { useCart } from "./hooks/useCart";
import { useCartTotals } from "./hooks/useCartTotals";
import { useCoupon } from "./hooks/useCoupon";
import { NotificationProvider } from "./hooks/useNotification";
import { useProduct } from "./hooks/useProduct";
import { useProductForm } from "./hooks/useProductForm";
import { useSearch } from "./hooks/useSearch";
import AdminPage from "./pages/AdminPage";
import { CustomerPage } from "./pages/CustomerPage";

// 메인 앱 컴포넌트 (NotificationProvider 내부에서 실행)
const AppContent = () => {
  /** 관리자 상태 여부 */
  const [isAdmin, setIsAdmin] = useState(false);

  /** 검색어 설정 */
  const { searchTerm, setSearchTerm, debouncedSearchTerm } = useSearch();

  /** 상품 hook 사용 */
  const { products, addProduct, updateProduct, deleteProduct } = useProduct();

  /** 상품 폼 hook 사용 */
  const { editingProduct, setEditingProduct, showProductForm, setShowProductForm, productForm, setProductForm, editProductForm, clearProductForm } = useProductForm();

  /** 선택된 쿠폰 */
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  /** 장바구니 hook 사용 */
  const { cart, setCart, addToCart, removeFromCart, updateCartQuantity, getRemainingStock, calculateItemTotal, totalItemCount } = useCart({ products });

  /** 장바구니 총액 계산 (할인 포함) */
  const cartTotals = useCartTotals({ cart, selectedCoupon, calculateItemTotal });

  /** 쿠폰 hook 사용 */
  const { coupons, applyCoupon, addCoupon, deleteCoupon } = useCoupon({ cartTotals, selectedCoupon, setSelectedCoupon });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isAdmin={isAdmin} searchTerm={searchTerm} setSearchTerm={setSearchTerm} setIsAdmin={setIsAdmin} totalItemCount={totalItemCount} />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? (
          <AdminPage
            products={products}
            addProduct={addProduct}
            updateProduct={updateProduct}
            clearProductForm={clearProductForm}
            productForm={productForm}
            editingProduct={editingProduct}
            showProductForm={showProductForm}
            setEditingProduct={setEditingProduct}
            setProductForm={setProductForm}
            setShowProductForm={setShowProductForm}
            editProductForm={editProductForm}
            deleteProduct={deleteProduct}
            getRemainingStock={getRemainingStock}
            coupons={coupons}
            deleteCoupon={deleteCoupon}
            addCoupon={addCoupon}
          />
        ) : (
          <CustomerPage
            isAdmin={isAdmin}
            products={products}
            cart={cart}
            setCart={setCart}
            debouncedSearchTerm={debouncedSearchTerm}
            addToCart={addToCart}
            removeFromCart={removeFromCart}
            updateCartQuantity={updateCartQuantity}
            getRemainingStock={getRemainingStock}
            calculateItemTotal={calculateItemTotal}
            totals={cartTotals}
            coupons={coupons}
            selectedCoupon={selectedCoupon}
            setSelectedCoupon={setSelectedCoupon}
            applyCoupon={applyCoupon}
          />
        )}
      </main>
    </div>
  );
};

// 루트 앱 컴포넌트 (Provider로 감싸기)
const App = () => {
  return (
    <NotificationProvider>
      <AppContent />
    </NotificationProvider>
  );
};

export default App;
