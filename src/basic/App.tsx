import { useState, useCallback, useEffect } from "react";
import { INotification } from "./type";
import { useProducts } from "./hooks/useProducts";
import { useCoupons } from "./hooks/useCoupons";
import { useCart } from "./hooks/useCart";
import Header from "./components/Header";
import NotificationItem from "./components/NotificationItem";
import AdminPage from "./pages/AdminPage";
import CartPage from "./pages/CartPage";

const App = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { coupons, addCoupon, removeCoupon } = useCoupons();
  const {
    cart,
    updateQuantity,
    addToCart,
    removeFromCart,
    clearCart,
    getRemainingStock,
    calculateItemTotal,
    cartTotal,
    selectedCoupon,
    setSelectedCoupon,
  } = useCart();

  // 관리자 페이지 여부
  const [isAdmin, setIsAdmin] = useState(false);
  // 토스트 모달 알람 배열
  const [notifications, setNotifications] = useState<INotification[]>([]);

  // 검색창 내 검색어
  const [searchTerm, setSearchTerm] = useState("");
  // 상품 검색어 - 자동으로 검색 반영되며 상품 페이지에 보여지는 값
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const addNotification = useCallback(
    (message: string, type: "error" | "success" | "warning" = "success") => {
      // 알림 구분을 위한 고유 식별자
      const id = Date.now().toString();
      setNotifications((prev) => [...prev, { id, message, type }]);

      // 3초 후 해당 알림 제거
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, 3000);
    },
    []
  );

  // 장바구니 내 전체 상품 수
  const [totalItemCount, setTotalItemCount] = useState(0);

  useEffect(() => {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    setTotalItemCount(count);
  }, [cart]);

  // 검색창 내 검색어가 바뀔 때 5초마다 바로 검색 반영
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 알림 표시 컨테이너 */}
      {notifications.length > 0 && (
        <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
          {notifications.map((notif) => (
            // 토스트 모달 컴포넌트
            <NotificationItem
              notification={notif}
              setNotifications={setNotifications}
            />
          ))}
        </div>
      )}

      {/* 헤더 */}
      <Header
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        cartItemCount={totalItemCount}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? (
          // 관리자 페이지
          <AdminPage
            products={products}
            addProduct={addProduct}
            updateProduct={updateProduct}
            deleteProduct={deleteProduct}
            getRemainingStock={getRemainingStock}
            coupons={coupons}
            addCoupon={addCoupon}
            removeCoupon={removeCoupon}
            selectedCoupon={selectedCoupon}
            setSelectedCoupon={setSelectedCoupon}
            addNotification={addNotification}
          />
        ) : (
          // 상품 및 장바구니 페이지
          <CartPage
            products={products}
            getRemainingStock={getRemainingStock}
            updateQuantity={updateQuantity}
            addToCart={addToCart}
            removeFromCart={removeFromCart}
            cart={cart}
            cartTotal={cartTotal}
            calculateItemTotal={calculateItemTotal}
            clearCart={clearCart}
            coupons={coupons}
            selectedCoupon={selectedCoupon}
            setSelectedCoupon={setSelectedCoupon}
            debouncedSearchTerm={debouncedSearchTerm}
            addNotification={addNotification}
          />
        )}
      </main>
    </div>
  );
};

export default App;
