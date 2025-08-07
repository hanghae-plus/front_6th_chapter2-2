import { useAdminMode } from "./hooks/useAdminMode";
import { useProducts } from "./hooks/useProducts";
import { useCoupons } from "./hooks/useCoupons";
import { useCart } from "./hooks/useCart";
import { useSearchTerm } from "./hooks/useSearchTerm";
import { useNotification } from "./hooks/useNotification";
import Header from "./components/Header";
import NotificationList from "./components/notification/NotificationList";
import AdminPage from "./pages/AdminPage";
import CartPage from "./pages/CartPage";

const App = () => {
  // 상품 관리
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();

  // 쿠폰 관리
  const { coupons, addCoupon, deleteCoupon } = useCoupons();

  // 장바구니 관리
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

  // 검색 처리
  const { searchTerm, debouncedSearchTerm, handleSearchTerm } = useSearchTerm();

  // 알림 처리
  const { notifications, addNotification, removeNotification } =
    useNotification();

  // 페이지 처리
  const { isAdmin, toggleAdmin } = useAdminMode();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 알림 표시 컨테이너 */}
      <NotificationList
        notifications={notifications}
        removeNotification={removeNotification}
      />

      {/* 헤더 */}
      <Header
        isAdmin={isAdmin}
        toggleAdmin={toggleAdmin}
        searchTerm={searchTerm}
        handleSearchTerm={handleSearchTerm}
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
