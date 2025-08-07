// hooks
import { useState } from "react";
import { useProducts } from "./hooks/useProducts";
import { useCart } from "./hooks/useCart";
import { useCoupons } from "./hooks/useCoupons";
import { useNotification } from "./hooks/useNotification";
import { useAutoCallback } from "./utils/hooks/useAutoCallbak";

// utils
import { useSearch } from "./utils/hooks/useSearch";
import { calculateCartTotalAmount, calculateFinalTotal } from "./utils/calculations";
import { calculateItemTotalWithDiscount } from "./utils/discounts";
import { withTryNotifySuccess, withTryNotifyError } from "./utils/withNotify";

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

  const cartTotals = calculateCartTotalAmount(cart, calculateItemTotal);

  // 쿠폰 적용된 총합 계산
  const getFinalTotal = useAutoCallback(() => calculateFinalTotal(cartTotals, selectedCoupon));

  // 장바구니에 상품 추가
  const addToCart = useAutoCallback(withTryNotifySuccess(addToCartHook, "장바구니에 담았습니다", addNotification));

  // 수량 업데이트
  const handleUpdateQuantity = useAutoCallback(
    withTryNotifyError((productId: string, newQuantity: number) => {
      updateQuantity(productId, newQuantity, products);
    }, addNotification)
  );

  // 쿠폰 적용
  const handleApplyCoupon = useAutoCallback(
    withTryNotifySuccess(
      (coupon: Coupon) => {
        const currentTotal = calculateCartTotalAmount(cart, calculateItemTotal);
        applyCoupon(coupon, currentTotal.totalAfterDiscount);
      },
      "쿠폰이 적용되었습니다.",
      addNotification
    )
  );

  // 주문 완료
  const completeOrder = useAutoCallback(() => {
    const orderNumber = `ORD-${Date.now()}`;
    addNotification(`주문이 완료되었습니다. 주문번호: ${orderNumber}`, "success");
    clearCart();
    setSelectedCoupon(null);
  });

  // 상품 추가
  const handleAddProduct = useAutoCallback(withTryNotifySuccess(addProduct, "상품이 추가되었습니다.", addNotification));

  // 상품 수정
  const handleUpdateProduct = useAutoCallback(
    withTryNotifySuccess(
      (productId: string, updates: Partial<Product>) => {
        updateProduct(productId, updates);
      },
      "상품이 수정되었습니다.",
      addNotification
    )
  );

  // 상품 삭제
  const handleDeleteProduct = useAutoCallback(
    withTryNotifySuccess(deleteProduct, "상품이 삭제되었습니다.", addNotification)
  );

  // 쿠폰 추가
  const handleAddCoupon = useAutoCallback(withTryNotifySuccess(addCoupon, "쿠폰이 추가되었습니다.", addNotification));

  // 쿠폰 삭제
  const handleDeleteCoupon = useAutoCallback(
    withTryNotifySuccess(deleteCoupon, "쿠폰이 삭제되었습니다.", addNotification)
  );

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
            onDeleteProduct={handleDeleteProduct}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            addNotification={addNotification}
            // 쿠폰 관련 props
            coupons={coupons}
            onDeleteCoupon={handleDeleteCoupon}
            onAddCoupon={handleAddCoupon}
          />
        ) : (
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
        )}
      </main>
    </div>
  );
};

export default App;
