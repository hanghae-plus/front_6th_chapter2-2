// hooks
import { useNotification } from "./hooks/useNotification";
import { useAppState } from "./hooks/useAppState";
import { useState } from "react";

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
    // UI 상태
    isAdmin,
    toggleAdmin,
  } = useAppState();

  // 장바구니 아이템 개수 상태
  const [totalItemCount, setTotalItemCount] = useState(0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Notification notifications={notifications} onRemove={removeNotification} />

      <Header isAdmin={isAdmin} onToggleAdmin={toggleAdmin} totalItemCount={totalItemCount} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? (
          <AdminPage addNotification={addNotification} />
        ) : (
          <ShopPage addNotification={addNotification} onTotalItemCountChange={setTotalItemCount} />
        )}
      </main>
    </div>
  );
};

export default App;
