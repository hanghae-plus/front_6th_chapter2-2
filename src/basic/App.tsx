import { useState, useCallback } from "react";
import { Notification } from "./types";
import { useCart } from "./hooks/useCart";
import { useProducts } from "./hooks/useProducts";
import HeaderLayout from "./components/Header/HeaderLayout";
import ShopHeaderContent from "./components/Header/ShopHeaderContent";
import AdminHeaderContent from "./components/Header/AdminHeaderContent";
import AdminPage from "./components/ui/AdminPage";
import CartPage from "./components/ui/CartPage";
import Toast from "./components/ui/Toast";
import {
  NOTIFICATION_DURATION,
  SEARCH_DEBOUNCE_DELAY,
} from "./constants/system";
import { useDebounce } from "./utils/hooks/useDebounce";

const App = () => {
  // ========== 📋 상태 관리 섹션 ==========

  // ========== 🔔 알림 시스템 ==========
  // 알림 메시지 추가 (3초 후 자동 삭제)
  const addNotification = useCallback(
    (message: string, type: "error" | "success" | "warning" = "success") => {
      const id = `${Date.now()}-${Math.random()}`;
      setNotifications((prev) => [...prev, { id, message, type }]);

      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, NOTIFICATION_DURATION);
    },
    []
  );

  // 🛒 장바구니 + 쿠폰 통합 관리 (useCart 훅 사용)
  const {
    cart,
    cartTotal,
    totalItemCount,
    getRemainingStock,
    calculateItemTotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    completeOrder,
    coupons,
    selectedCoupon,
    addCoupon,
    removeCoupon,
    applyCoupon,
  } = useCart(addNotification);

  // 📦 상품 관리 (useProducts 훅 사용)
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    getFilteredProducts,
  } = useProducts(addNotification);

  // 🎛️ UI 상태들
  const [isAdmin, setIsAdmin] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, SEARCH_DEBOUNCE_DELAY);

  // 알림 메시지 제거
  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  // 검색어로 필터링된 상품 목록
  const filteredProducts = getFilteredProducts(debouncedSearchTerm);

  // ========== 🎨 렌더링 섹션 ==========
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 🔔 알림 메시지들 - 화면 우상단에 표시 */}
      <Toast
        notifications={notifications}
        onRemoveNotification={removeNotification}
      />
      <HeaderLayout>
        {isAdmin ? (
          <AdminHeaderContent onToggleContent={() => setIsAdmin(!isAdmin)} />
        ) : (
          <ShopHeaderContent
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onToggleContent={() => setIsAdmin(!isAdmin)}
            cartItemCount={totalItemCount}
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
            addNotification={addNotification}
          />
        ) : (
          <CartPage
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
            onUpdateQuantity={(productId: string, newQuantity: number) =>
              updateQuantity(productId, newQuantity, products)
            }
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
