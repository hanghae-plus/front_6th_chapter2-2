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
    setNotifications,
    addNotification,
    isAdmin,
    setIsAdmin,

    // 도메인 상태
    products,
    setProducts,
    cart,
    setCart,
    totalItemCount,

    // 도메인 핸들러들
    addProduct,
    updateProduct,
    deleteProduct,
    addToCart,
    removeFromCart,
    updateQuantity,

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
          setNotifications={setNotifications}
        />
      )}

      <Header
        isAdmin={isAdmin}
        searchTerm={searchTerm}
        handleSearch={handleSearch}
        cart={cart}
        totalItemCount={totalItemCount}
        setIsAdmin={setIsAdmin}
      />

      <Body>
        {isAdmin ? (
          <AdminPage
            products={products}
            setProducts={setProducts}
            addProduct={addProduct}
            updateProduct={updateProduct}
            deleteProduct={deleteProduct}
            checkSoldOutByProductId={checkSoldOutByProductId}
            isAdmin={isAdmin}
            addNotification={addNotification}
          />
        ) : (
          <CartPage
            products={products}
            filteredProducts={filteredProducts}
            debouncedSearchTerm={debouncedSearchTerm}
            cart={cart}
            setCart={setCart}
            checkSoldOutByProductId={checkSoldOutByProductId}
            isAdmin={isAdmin}
            addToCart={addToCart}
            removeFromCart={removeFromCart}
            updateQuantity={updateQuantity}
            addNotification={addNotification}
          />
        )}
      </Body>
    </Layout>
  );
};

export default App;
