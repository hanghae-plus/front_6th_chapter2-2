// hooks
import { useState } from "react";
import { Provider } from "jotai";
import { useProducts } from "./hooks/useProducts";
import { useCart } from "./hooks/useCart";
import { useCoupons } from "./hooks/useCoupons";
import { useNotification } from "./hooks/useNotification";
import { useAutoCallback } from "./utils/hooks/useAutoCallbak";

// utils
import { useSearch } from "./utils/hooks/useSearch";

// components
import { Header } from "./components/ui/header/Header";
import { Notification } from "./components/ui/notification/Notification";

// pages
import AdminPage from "./pages/Admin/AdminPage";
import ShopPage from "./pages/Main/ShopPage/ShopPage";

// type

const AppContent = () => {
  // 커스텀 훅 사용
  const { notifications, addNotification, removeNotification } = useNotification();

  const { products, addProduct, updateProduct, deleteProduct } = useProducts(addNotification);
  const { cart, totalItemCount, addToCart, removeFromCart, updateQuantity, clearCart } = useCart(addNotification);
  const { coupons, selectedCoupon, addCoupon, deleteCoupon, applyCoupon, setSelectedCoupon } =
    useCoupons(addNotification);

  const { searchTerm, setSearchTerm, filteredProducts, searchInfo } = useSearch(products);

  // 로컬 UI 상태
  const [isAdmin, setIsAdmin] = useState(false);

  const completeOrder = useAutoCallback(() => {
    const orderNumber = `ORD-${Date.now()}`;
    addNotification(`주문이 완료되었습니다. 주문번호: ${orderNumber}`, "success");
    clearCart();
    setSelectedCoupon(null);
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Notification notifications={notifications} onRemove={removeNotification} />

      <Header
        isAdmin={isAdmin}
        searchTerm={searchTerm}
        totalItemCount={totalItemCount}
        cartItemCount={cart.length}
        onSearchChange={setSearchTerm}
        onToggleAdmin={() => setIsAdmin(!isAdmin)}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? (
          <AdminPage
            // 상품 관련 props
            products={products}
            cart={cart}
            onDeleteProduct={deleteProduct}
            onAddProduct={addProduct}
            onUpdateProduct={updateProduct}
            addNotification={addNotification}
            // 쿠폰 관련 props
            coupons={coupons}
            onDeleteCoupon={deleteCoupon}
            onAddCoupon={addCoupon}
          />
        ) : (
          <ShopPage
            products={filteredProducts}
            cart={cart}
            coupons={coupons}
            selectedCoupon={selectedCoupon}
            searchInfo={searchInfo}
            onRemoveFromCart={removeFromCart}
            onUpdateQuantity={(productId, quantity) => updateQuantity(productId, quantity, products)}
            onApplyCoupon={applyCoupon}
            onRemoveCoupon={() => setSelectedCoupon(null)}
            onCompleteOrder={completeOrder}
            onAddToCart={addToCart}
          />
        )}
      </main>
    </div>
  );
};

const App = () => {
  return (
    <Provider>
      <AppContent />
    </Provider>
  );
};

export default App;
