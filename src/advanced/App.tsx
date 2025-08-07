import { useAdminMode } from "./hooks/useAdminMode";
import Header from "./components/Header";
import NotificationList from "./components/notification/NotificationList";
import AdminPage from "./pages/AdminPage";
import CartPage from "./pages/CartPage";

const App = () => {
  // 페이지 처리
  const { isAdmin, toggleAdmin } = useAdminMode();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 알림 표시 컨테이너 */}
      <NotificationList />

      {/* 헤더 */}
      <Header isAdmin={isAdmin} toggleAdmin={toggleAdmin} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? (
          // 관리자 페이지
          <AdminPage />
        ) : (
          // 상품 및 장바구니 페이지
          <CartPage />
        )}
      </main>
    </div>
  );
};

export default App;
