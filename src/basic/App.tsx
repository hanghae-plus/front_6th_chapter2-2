// hooks
import { useState, useCallback } from "react";
import { useProducts } from "./hooks/useProducts";
import { useCart } from "./hooks/useCart";
import { useCoupons } from "./hooks/useCoupons";
import { useNotification } from "./hooks/useNotification";
import { useProductForm } from "./hooks/useProductForm";

// utils
import { useSearch } from "./utils/hooks/useSearch";
import { calculateFinalTotal } from "./utils/calculations";
import { withTryNotifySuccess, withTryNotifyError } from "./utils/errorHandler";

// components
import { Header } from "./components/ui/header/Header";
import { Notification } from "./components/ui/notification/Notification";

// pages
import AdminPage from "./pages/Admin/AdminPage";
import ShopPage from "./pages/Main/ShopPage/ShopPage";

// type
import { Coupon, Product } from "../types";

const App = () => {
  // 커스텀 훅 사용
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const {
    cart,
    totalItemCount,
    calculateItemTotal,
    calculateCartTotal,
    addToCart: addToCartHook,
    removeFromCart,
    updateQuantity,
    clearCart,
  } = useCart();
  const { coupons, selectedCoupon, addCoupon, deleteCoupon, applyCoupon, setSelectedCoupon } = useCoupons();
  const { notifications, addNotification, removeNotification } = useNotification();

  // 검색 기능
  const { searchTerm, setSearchTerm, filteredProducts, searchInfo } = useSearch(products);

  // 로컬 UI 상태
  const [isAdmin, setIsAdmin] = useState(false);
  const [showCouponForm, setShowCouponForm] = useState(false);

  // Product Form 관리
  const {
    editingProduct,
    productForm,
    showProductForm,
    setProductForm,
    startEditProduct,
    startAddProduct,
    cancelProductForm,
    handleProductSubmit: handleProductFormSubmit,
  } = useProductForm();

  const [couponForm, setCouponForm] = useState({
    name: "",
    code: "",
    discountType: "amount" as "amount" | "percentage",
    discountValue: 0,
  });

  const cartTotals = calculateCartTotal();

  // 쿠폰 적용된 총합 계산
  const getFinalTotal = useCallback(
    () => calculateFinalTotal(cartTotals, selectedCoupon),
    [cartTotals, selectedCoupon]
  );

  // 장바구니에 상품 추가
  const addToCart = useCallback(withTryNotifySuccess(addToCartHook, "장바구니에 담았습니다", addNotification), [
    addToCartHook,
    addNotification,
  ]);

  // 수량 업데이트
  const handleUpdateQuantity = useCallback(
    withTryNotifyError((productId: string, newQuantity: number) => {
      updateQuantity(productId, newQuantity, products);
    }, addNotification),
    [updateQuantity, products, addNotification]
  );

  // 쿠폰 적용
  const handleApplyCoupon = useCallback(
    withTryNotifySuccess(
      (coupon: Coupon) => {
        const currentTotal = calculateCartTotal().totalAfterDiscount;
        applyCoupon(coupon, currentTotal);
      },
      "쿠폰이 적용되었습니다.",
      addNotification
    ),
    [applyCoupon, calculateCartTotal, addNotification]
  );

  // 주문 완료
  const completeOrder = useCallback(() => {
    const orderNumber = `ORD-${Date.now()}`;
    addNotification(`주문이 완료되었습니다. 주문번호: ${orderNumber}`, "success");
    clearCart();
    setSelectedCoupon(null);
  }, [addNotification, clearCart, setSelectedCoupon]);

  // 상품 추가
  const handleAddProduct = useCallback(withTryNotifySuccess(addProduct, "상품이 추가되었습니다.", addNotification), [
    addProduct,
    addNotification,
  ]);

  // 상품 수정
  const handleUpdateProduct = useCallback(
    withTryNotifySuccess(
      (productId: string, updates: Partial<Product>) => {
        updateProduct(productId, updates);
      },
      "상품이 수정되었습니다.",
      addNotification
    ),
    [updateProduct, addNotification]
  );

  // 상품 삭제
  const handleDeleteProduct = useCallback(
    withTryNotifySuccess(deleteProduct, "상품이 삭제되었습니다.", addNotification),
    [deleteProduct, addNotification]
  );

  // 쿠폰 추가
  const handleAddCoupon = useCallback(withTryNotifySuccess(addCoupon, "쿠폰이 추가되었습니다.", addNotification), [
    addCoupon,
    addNotification,
  ]);

  // 쿠폰 삭제
  const handleDeleteCoupon = useCallback(
    withTryNotifySuccess(deleteCoupon, "쿠폰이 삭제되었습니다.", addNotification),
    [deleteCoupon, addNotification]
  );

  const handleProductSubmit = (e: React.FormEvent) => {
    handleProductFormSubmit(e, handleAddProduct, handleUpdateProduct);
  };

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAddCoupon(couponForm);
    setCouponForm({
      name: "",
      code: "",
      discountType: "amount",
      discountValue: 0,
    });
    setShowCouponForm(false);
  };

  const totals = getFinalTotal();

  return (
    <div className="min-h-screen bg-gray-50">
      <Notification notifications={notifications} onRemove={removeNotification} />

      <Header
        isAdmin={isAdmin}
        searchTerm={searchTerm}
        totalItemCount={totalItemCount}
        cartItemCount={cart.length}
        onSearchChange={setSearchTerm}
        onToggleAdmin={() => setIsAdmin(!isAdmin)}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? (
          <AdminPage
            // 상품 관련 props
            products={products}
            cart={cart}
            onEditProduct={startEditProduct}
            onDeleteProduct={handleDeleteProduct}
            onAddProduct={startAddProduct}
            showProductForm={showProductForm}
            productForm={productForm}
            setProductForm={setProductForm}
            editingProduct={editingProduct}
            onProductSubmit={handleProductSubmit}
            onCancelProductForm={cancelProductForm}
            addNotification={addNotification}
            // 쿠폰 관련 props
            coupons={coupons}
            onDeleteCoupon={handleDeleteCoupon}
            showCouponForm={showCouponForm}
            setShowCouponForm={setShowCouponForm}
            couponForm={couponForm}
            setCouponForm={setCouponForm}
            onCouponSubmit={handleCouponSubmit}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <ShopPage
              products={filteredProducts}
              cart={cart}
              coupons={coupons}
              selectedCoupon={selectedCoupon}
              totals={totals}
              searchInfo={searchInfo}
              calculateItemTotal={calculateItemTotal}
              onRemoveFromCart={removeFromCart}
              onUpdateQuantity={handleUpdateQuantity}
              onApplyCoupon={handleApplyCoupon}
              onRemoveCoupon={() => setSelectedCoupon(null)}
              onCompleteOrder={completeOrder}
              onAddToCart={addToCart}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
