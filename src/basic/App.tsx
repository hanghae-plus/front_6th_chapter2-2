import { useState } from "react";
import { useProducts } from "./hooks/useProducts";
import { useCoupons } from "./hooks/useCoupons";
import { useCart } from "./hooks/useCart";
import { useNotification } from "./hooks/useNotification";
import Header from "./components/Header";
import NotificationItem from "./components/NotificationItem";
import AdminPage from "./pages/AdminPage";
import CartPage from "./pages/CartPage";
import { useDebounce } from "./utils/hooks/useDebounce";

const App = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { coupons, addCoupon, deleteCoupon } = useCoupons();
  const {
    cart,
    updateQuantity,
    addToCart,
    removeFromCart,
    clearCart,
    getRemainingStock,
    calculateItemTotal,
    cartTotalPrice,
    cartTotalItem,
    selectedCoupon,
    setSelectedCoupon,
  } = useCart();

  const {notifications, addNotification, removeNotification} = useNotification();

  // 관리자 페이지 여부
  const [isAdmin, setIsAdmin] = useState(false);

  // 검색창 내 검색어
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 알림 표시 컨테이너 */}
      {notifications.length > 0 && (
        <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
          {notifications.map((notif) => (
            // 토스트 모달 컴포넌트
            <NotificationItem
              key={notif.id}
              notification={notif}
              removeNotification={removeNotification}
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
        cartTotalItem={cartTotalItem}
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
            deleteCoupon={deleteCoupon}
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
            cartTotalPrice={cartTotalPrice}
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
