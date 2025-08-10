import { Product } from "../types";
import NotificationToast from "./components/ui/NotificationToast";
import { useCartActions } from "./hooks/useCartActions";
import { useCouponActions } from "./hooks/useCouponActions";
import { useProduct } from "./hooks/useProduct";
import { useAdminMode } from "./hooks/useAdminMode";
import { useSearch } from "./hooks/useSearch";
import useNotification from "./utils/hooks/useNotification";
import AdminPage from "./pages/AdminPage";
import CartPage from "./pages/CartPage";
import Header from "./layout/Header";

export interface ProductWithUI extends Product {
  description?: string;
  isRecommended?: boolean;
}

const App = () => {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    searchProduct,
    getStockStatus,
  } = useProduct();

  // 알림 기능
  const notification = useNotification();

  // 카트 액션들 (알림 콜백 포함)
  const {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    completeOrder,
    calculateItemTotal,
  } = useCartActions({
    onSuccess: (message) => notification.add(message, "success"),
    onError: (message) => notification.add(message, "error"),
  });

  // 쿠폰 액션들 (알림 콜백 포함)
  const {
    selectedCoupon,
    coupons,
    applyCoupon,
    addCoupon,
    deleteCoupon,
    clearSelectedCoupon,
  } = useCouponActions({
    onSuccess: (message) => notification.add(message, "success"),
    onError: (message) => notification.add(message, "error"),
  });

  // 어드민 모드 관리
  const { isAdmin, toggleAdmin } = useAdminMode();

  // 검색어 관리
  const { searchTerm, setSearchTerm, debouncedSearchTerm } = useSearch();

  return (
    <div className="min-h-screen bg-gray-50">
      <NotificationToast
        notifications={notification.notifications}
        onRemove={notification.remove}
      />
      <Header
        isAdmin={isAdmin}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        cart={cart}
        onToggleAdmin={toggleAdmin}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? (
          <AdminPage
            isAdmin={isAdmin}
            products={products}
            coupons={coupons}
            addProduct={addProduct}
            updateProduct={updateProduct}
            deleteProduct={deleteProduct}
            addCoupon={addCoupon}
            deleteCoupon={deleteCoupon}
            notification={notification}
          />
        ) : (
          <CartPage
            products={products}
            cart={cart}
            coupons={coupons}
            selectedCoupon={selectedCoupon}
            searchTerm={searchTerm}
            debouncedSearchTerm={debouncedSearchTerm}
            addToCart={addToCart}
            removeFromCart={removeFromCart}
            updateQuantity={updateQuantity}
            calculateItemTotal={calculateItemTotal}
            applyCoupon={(coupon) => applyCoupon(coupon, cart)}
            clearSelectedCoupon={clearSelectedCoupon}
            completeOrder={completeOrder}
            searchProduct={searchProduct}
            getStockStatus={getStockStatus}
          />
        )}
      </main>
    </div>
  );
};

export default App;
