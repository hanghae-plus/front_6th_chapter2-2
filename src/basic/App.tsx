// hooks
import { useNotification } from "./hooks/useNotification";
import { useAppState } from "./hooks/useAppState";

// components
import { Header } from "./components/ui/header/Header";
import { Notification } from "./components/ui/notification/Notification";

// pages
import AdminPage from "./pages/Admin/AdminPage";
import ShopPage from "./pages/Main/ShopPage/ShopPage";

const App = () => {
  // 알림 시스템
  const { notifications, addNotification, removeNotification } = useNotification();

  // 앱 전체 상태 관리
  const {
    // 도메인별 상태
    cart,
    coupons,
    selectedCoupon,

    // 도메인별 액션
    addToCart,
    removeFromCart,
    updateQuantity,
    addCoupon,
    deleteCoupon,
    applyCoupon,
    setSelectedCoupon,
    completeOrder,

    // UI 상태
    isAdmin,
    toggleAdmin,
    totalItemCount,
  } = useAppState(addNotification);

  return (
    <div className="min-h-screen bg-gray-50">
      <Notification notifications={notifications} onRemove={removeNotification} />

      <Header
        isAdmin={isAdmin}
        totalItemCount={totalItemCount}
        cartItemCount={cart.length}
        onToggleAdmin={toggleAdmin}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? (
          <AdminPage
            // 쿠폰 관련 props
            coupons={coupons}
            onDeleteCoupon={deleteCoupon}
            onAddCoupon={addCoupon}
            addNotification={addNotification}
          />
        ) : (
          <ShopPage
            cart={cart}
            coupons={coupons}
            selectedCoupon={selectedCoupon}
            onRemoveFromCart={removeFromCart}
            onUpdateQuantity={updateQuantity}
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

export default App;
