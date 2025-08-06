import { useState } from "react";
import { useCart } from "./hooks/useCart";
import { useProducts } from "./hooks/useProducts";
import HeaderLayout from "./components/Header/HeaderLayout";
import ShopHeaderContent from "./components/Header/ShopHeaderContent";
import AdminHeaderContent from "./components/Header/AdminHeaderContent";
import AdminPage from "./components/ui/AdminPage";
import ShopPage from "./components/ui/ShopPage";
import Toast from "./components/ui/Toast";

const App = () => {
  // =========== 페이지 전환 관리 ===========
  const [isAdmin, setIsAdmin] = useState(false);

  // =========== 장바구니 관리 ===========
  const {
    // 장바구니
    cart,
    cartTotal,
    getRemainingStock,
    calculateItemTotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    completeOrder,
    // 쿠폰
    coupons,
    selectedCoupon,
    addCoupon,
    removeCoupon,
    applyCoupon,
  } = useCart();

  // =========== 상품 관리 ===========
  const {
    // 상품
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    // 검색
    searchTerm,
    setSearchTerm,
    debouncedSearchTerm,
    filteredProducts,
  } = useProducts();

  return (
    <div className="min-h-screen bg-gray-50">
      <Toast />
      <HeaderLayout>
        {isAdmin ? (
          <AdminHeaderContent onToggleContent={() => setIsAdmin(!isAdmin)} />
        ) : (
          <ShopHeaderContent
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onToggleContent={() => setIsAdmin(!isAdmin)}
          />
        )}
      </HeaderLayout>
      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? (
          <AdminPage
            products={products}
            onAddProduct={addProduct}
            onUpdateProduct={updateProduct}
            onDeleteProduct={deleteProduct}
            getRemainingStock={getRemainingStock}
            coupons={coupons}
            onAddCoupon={addCoupon}
            onDeleteCoupon={removeCoupon}
          />
        ) : (
          <ShopPage
            products={products}
            filteredProducts={filteredProducts}
            debouncedSearchTerm={debouncedSearchTerm}
            getRemainingStock={getRemainingStock}
            onAddToCart={addToCart}
            cart={cart}
            coupons={coupons}
            selectedCoupon={selectedCoupon}
            totals={cartTotal}
            onRemoveFromCart={removeFromCart}
            onUpdateQuantity={updateQuantity}
            onApplyCoupon={applyCoupon}
            onCompleteOrder={completeOrder}
            calculateItemTotal={calculateItemTotal}
          />
        )}
      </main>
    </div>
  );
};

export default App;
