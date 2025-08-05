import { useCallback, useState } from "react";

import { ProductWithUI } from "./types";

import { useCoupons } from "./hooks/useCoupons";
import { useCart } from "./hooks/useCart";
import { useProducts } from "./hooks/useProducts";
import { useNotifications } from "./hooks/useNotifications";

import { calculateCartTotal } from "./service/cart";

import Layout from "./components/Layout";
import Header from "./components/Layout/Header";
import AdminPage from "./components/admin/AdminPage";
import CartSection from "./components/cart/CartSection";
import ProductListSection from "./components/product/ProductSection";
import NotificationToast from "./components/ui/UIToast";
import { Coupon } from "../types";
import { useAdminMode } from "./hooks/useAdminMode";
import { useFilteredProducts } from "./hooks/useFilteredProducts";

function App() {
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // 관리자 모드 토글 함수
  const { isAdmin, handleToggleAdmin } = useAdminMode();

  // 알림(노티피케이션) 관련 로직을 관리하는 커스텀 훅
  const { notifications, addNotification, removeNotification } =
    useNotifications();

  // 쿠폰 관련 로직을 관리하는 커스텀 훅
  const { coupons, addCoupon, removeCoupon } = useCoupons();

  // 상품 관련 로직을 관리하는 커스텀 훅
  const { products, addProduct, updateProduct, removeProduct } = useProducts();

  // 장바구니 관련 로직을 관리하는 커스텀 훅
  const {
    cart,
    totalCartCount,
    getRemainingStock,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  } = useCart(products);

  // 디바운스된 검색어를 기준으로 상품 목록을 필터링
  const { filteredProducts, debouncedSearchTerm } = useFilteredProducts(
    products,
    searchTerm
  );

  // 주문 완료
  const handleCompleteOrder = useCallback(() => {
    const orderNumber = `ORD-${Date.now()}`;
    addNotification(
      `주문이 완료되었습니다. 주문번호: ${orderNumber}`,
      "success"
    );
    clearCart();
    setSelectedCoupon(null);
  }, [addNotification, clearCart]);

  // 쿠폰 관련 핸들러 묶음
  const couponHandlers = {
    apply: useCallback(
      (coupon: Coupon) => {
        const currentTotal = calculateCartTotal(
          cart,
          selectedCoupon
        ).totalAfterDiscount;

        if (currentTotal < 10000 && coupon.discountType === "percentage") {
          addNotification(
            "percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.",
            "error"
          );
          return;
        }

        setSelectedCoupon(coupon);
        addNotification("쿠폰이 적용되었습니다.", "success");
      },
      [cart, selectedCoupon, addNotification]
    ),

    add: useCallback(
      (newCoupon: Coupon) => {
        addCoupon(newCoupon, addNotification);
      },
      [addCoupon, addNotification]
    ),

    delete: useCallback(
      (couponCode: string) => {
        removeCoupon(
          couponCode,
          selectedCoupon,
          setSelectedCoupon,
          addNotification
        );
      },
      [removeCoupon, selectedCoupon, addNotification]
    ),
  };

  // 장바구니 관련 핸들러 묶음
  const cartHandlers = {
    addToCart: useCallback(
      (product: ProductWithUI) => {
        addToCart(product, addNotification);
      },
      [addToCart, addNotification]
    ),

    updateQuantity: useCallback(
      (productId: string, newQuantity: number) => {
        updateQuantity(productId, newQuantity, addNotification);
      },
      [updateQuantity, addNotification]
    ),
  };

  // 상품 관련 핸들러 묶음
  const productHandlers = {
    add: useCallback(
      (newProduct: Omit<ProductWithUI, "id">) => {
        addProduct(newProduct, addNotification);
      },
      [addProduct, addNotification]
    ),

    update: useCallback(
      (productId: string, updates: Partial<ProductWithUI>) => {
        updateProduct(productId, updates, addNotification);
      },
      [updateProduct, addNotification]
    ),

    delete: useCallback(
      (productId: string) => {
        removeProduct(productId, addNotification);
      },
      [removeProduct, addNotification]
    ),
  };

  return (
    <Layout>
      <NotificationToast
        notifications={notifications}
        onRemove={removeNotification}
      />
      <Header
        isAdmin={isAdmin}
        onChangeIsAdmin={handleToggleAdmin}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        cartCount={cart.length}
        totalCartCount={totalCartCount}
      />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? (
          <AdminPage
            products={products}
            coupons={coupons}
            onAddProduct={productHandlers.add}
            onUpdateProduct={productHandlers.update}
            onDeleteProduct={productHandlers.delete}
            onAddCoupon={couponHandlers.add}
            onDeleteCoupon={couponHandlers.delete}
            addNotification={addNotification}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <ProductListSection
              products={products}
              filteredProducts={filteredProducts}
              debouncedSearchTerm={debouncedSearchTerm}
              getRemainingStock={getRemainingStock}
              handleAddToCart={cartHandlers.addToCart}
              isAdmin={isAdmin}
            />

            <div className="lg:col-span-1">
              <CartSection
                cart={cart}
                coupons={coupons}
                selectedCoupon={selectedCoupon}
                onRemove={removeFromCart}
                onUpdateQuantity={cartHandlers.updateQuantity}
                onApplyCoupon={couponHandlers.apply}
                onCompleteOrder={handleCompleteOrder}
              />
            </div>
          </div>
        )}
      </main>
    </Layout>
  );
}

export default App;
