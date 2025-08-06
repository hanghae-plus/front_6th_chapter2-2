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
    totalItemCount,
    coupons,
    selectedCoupon,
    setSelectedCoupon,

    // 도메인 핸들러들
    addProduct,
    updateProduct,
    deleteProduct,
    addToCart,
    removeFromCart,
    updateQuantity,
    addCoupon,
    deleteCoupon,
    applyCoupon,

    // 폼 관련
    productForm,
    setProductForm,
    editingProduct,
    setEditingProduct,
    showProductForm,
    setShowProductForm,
    startEditProduct,

    // 검색 관련
    searchTerm,
    handleSearch,
    debouncedSearchTerm,
    filteredProducts,

    // 관리자 핸들러들
    activeTab,
    setActiveTab,
    showCouponForm,
    setShowCouponForm,
    couponForm,
    setCouponForm,
    handleProductSubmit,
    handleCouponSubmit,

    // 주문 핸들러들
    completeOrder,

    // 유틸리티
    checkSoldOutByProductId,

    // 계산된 값들
    totals,
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
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            products={products}
            setProducts={setProducts}
            addProduct={addProduct}
            updateProduct={updateProduct}
            deleteProduct={deleteProduct}
            coupons={coupons}
            deleteCoupon={deleteCoupon}
            addCoupon={addCoupon}
            addNotification={addNotification}
            productForm={productForm}
            setProductForm={setProductForm}
            editingProduct={editingProduct}
            setEditingProduct={setEditingProduct}
            showProductForm={showProductForm}
            setShowProductForm={setShowProductForm}
            startEditProduct={startEditProduct}
            handleProductSubmit={handleProductSubmit}
            couponForm={couponForm}
            setCouponForm={setCouponForm}
            showCouponForm={showCouponForm}
            setShowCouponForm={setShowCouponForm}
            handleCouponSubmit={handleCouponSubmit}
            checkSoldOutByProductId={checkSoldOutByProductId}
            isAdmin={isAdmin}
          />
        ) : (
          <CartPage
            products={products}
            filteredProducts={filteredProducts}
            debouncedSearchTerm={debouncedSearchTerm}
            cart={cart}
            checkSoldOutByProductId={checkSoldOutByProductId}
            isAdmin={isAdmin}
            addToCart={addToCart}
            removeFromCart={removeFromCart}
            updateQuantity={updateQuantity}
            coupons={coupons}
            selectedCoupon={selectedCoupon}
            setSelectedCoupon={setSelectedCoupon}
            applyCoupon={applyCoupon}
            completeOrder={completeOrder}
            totals={totals}
          />
        )}
      </Body>
    </Layout>
  );
};

export default App;
