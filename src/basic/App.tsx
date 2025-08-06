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

    // 네임스페이스 구조
    product,
    cart,
    coupon,

    // 하위 호환성 (점진적 마이그레이션을 위해 일부 유지)
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    searchTerm,
    handleSearch,
    debouncedSearchTerm,
    filteredProducts,
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
        cart={cart.items}
        totalItemCount={cart.totalItemCount}
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
            cart={cart.items}
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
