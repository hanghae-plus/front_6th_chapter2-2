import { useAppCore } from "./hooks/useAppCore";

import { Header } from "./components/layouts/Header";
import { Layout } from "./components/layouts/Layout";
import { Body } from "./components/layouts/Body";
import { AdminPage } from "./pages/AdminPage";
import { CartPage } from "./pages/CartPage";
import { NotificationComponent } from "./components/ui/notification/Notification";

const App = () => {
  const {
    // 기본 상태
    notifications,
    addNotification,
    removeNotification,
    isAdmin,
    toggleAdminMode,

    // 도메인 상태
    products,
    cart,
    totalItemCount,

    // 도메인 핸들러들
    addProduct,
    updateProduct,
    deleteProduct,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,

    // 검색 관련
    searchTerm,
    handleSearch,
    debouncedSearchTerm,
    filteredProducts,

    // 유틸리티
    checkSoldOutByProductId,
  } = useAppCore();

  return (
    <Layout>
      {notifications.length > 0 && (
        <NotificationComponent
          notifications={notifications}
          onRemoveNotification={removeNotification}
        />
      )}

      <Header
        isAdmin={isAdmin}
        searchTerm={searchTerm}
        handleSearch={handleSearch}
        cart={cart}
        totalItemCount={totalItemCount}
        onToggleAdminMode={toggleAdminMode}
      />

      <Body>
        {isAdmin ? (
          <AdminPage
            products={products}
            addProduct={addProduct}
            updateProduct={updateProduct}
            deleteProduct={deleteProduct}
            checkSoldOutByProductId={checkSoldOutByProductId}
            addNotification={addNotification}
          />
        ) : (
          <CartPage
            products={products}
            filteredProducts={filteredProducts}
            debouncedSearchTerm={debouncedSearchTerm}
            cart={cart}
            checkSoldOutByProductId={checkSoldOutByProductId}
            addToCart={addToCart}
            removeFromCart={removeFromCart}
            updateQuantity={updateQuantity}
            onClearCart={clearCart}
            addNotification={addNotification}
          />
        )}
      </Body>
    </Layout>
  );
};

export default App;
