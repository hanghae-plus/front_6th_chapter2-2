// hooks
import { useState } from "react";
import { Provider } from "jotai";
import { useProducts } from "./hooks/useProducts";
import { useCart } from "./hooks/useCart";
import { useCoupons } from "./hooks/useCoupons";
import { useNotification } from "./hooks/useNotification";

// utils
import { useProductSearch } from "./utils/hooks/useSearch";

// components
import { Header } from "./components/ui/header/Header";
import { Notification } from "./components/ui/notification/Notification";

// pages
import AdminPage from "./pages/Admin/AdminPage";
import ShopPage from "./pages/Main/ShopPage/ShopPage";

// type

const AppContent = () => {
  // 커스텀 훅 사용
  const { notifications, addNotification, removeNotification } = useNotification();

  const { addProduct, updateProduct, deleteProduct } = useProducts(addNotification);
  const { addCoupon, deleteCoupon } = useCoupons(addNotification);

  const { searchTerm, setSearchTerm } = useProductSearch();

  // 로컬 UI 상태
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Notification notifications={notifications} onRemove={removeNotification} />

      <Header
        isAdmin={isAdmin}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onToggleAdmin={() => setIsAdmin(!isAdmin)}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? (
          <AdminPage
            // 상품 관련 props
            onDeleteProduct={deleteProduct}
            onAddProduct={addProduct}
            onUpdateProduct={updateProduct}
            addNotification={addNotification}
            // 쿠폰 관련 props
            onDeleteCoupon={deleteCoupon}
            onAddCoupon={addCoupon}
          />
        ) : (
          <ShopPage searchTerm={searchTerm} />
        )}
      </main>
    </div>
  );
};

const App = () => {
  return (
    <Provider>
      <AppContent />
    </Provider>
  );
};

export default App;
