import { useState, useCallback, useEffect } from "react";
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

const App = () => {
  // ========== 📋 상태 관리 섹션 ==========

  // ========== 🔔 알림 시스템 ==========
  // 알림 메시지 추가 (3초 후 자동 삭제)
  const addNotification = useCallback(
    (message: string, type: "error" | "success" | "warning" = "success") => {
      const id = Date.now().toString();
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
    totals,
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
  const { products, addProduct, updateProduct, deleteProduct, getFilteredProducts } =
    useProducts(addNotification);

  // 🎛️ UI 상태들
  const [isAdmin, setIsAdmin] = useState(false); // 관리자 모드 여부
  const [notifications, setNotifications] = useState<Notification[]>([]); // 알림 메시지들
  const [searchTerm, setSearchTerm] = useState(""); // 검색어
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(""); // 디바운스된 검색어

  // 알림 메시지 제거
  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  // 장바구니 총 아이템 개수 (헤더 뱃지용)
  const [totalItemCount, setTotalItemCount] = useState(0);

  // ========== 🔄 useEffect 훅들 ==========
  // 장바구니 총 개수 계산
  useEffect(() => {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    setTotalItemCount(count);
  }, [cart]);


  // 검색어 디바운싱
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, SEARCH_DEBOUNCE_DELAY);
    return () => clearTimeout(timer);
  }, [searchTerm]);

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
            totals={totals}
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
