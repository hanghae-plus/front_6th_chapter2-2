import { useState } from "react";

// hooks
import { useNotification } from "./hooks/useNotification";
import { useAppState } from "./hooks/useAppState";

// components
import { Header } from "./components/ui/header/Header";
import { Notification } from "./components/ui/notification/Notification";

// pages
import AdminPage from "./pages/Admin/AdminPage";
import ShopPage from "./pages/Main/ShopPage";

const App = () => {
  // 알림 시스템
  const { notifications, addNotification, removeNotification } = useNotification();

  // 앱 전체 상태 관리
  const { isAdmin, toggleAdmin, totalItemCount, setTotalItemCount } = useAppState();

  // 검색 상태 관리
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="min-h-screen bg-gray-50">
      <Notification notifications={notifications} onRemove={removeNotification} />

      <Header
        isAdmin={isAdmin}
        onToggleAdmin={toggleAdmin}
        totalItemCount={totalItemCount}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? (
          <AdminPage addNotification={addNotification} />
        ) : (
          <ShopPage
            addNotification={addNotification}
            onTotalItemCountChange={setTotalItemCount}
            searchTerm={searchTerm}
          />
        )}
      </main>
    </div>
  );
};

export default App;
