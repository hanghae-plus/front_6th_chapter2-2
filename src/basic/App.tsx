import { useCallback, useState } from "react";

import { ProductWithUI } from "./types";

import { useCoupons } from "./hooks/useCoupons";
import { useCart } from "./hooks/useCart";
import { useProducts } from "./hooks/useProducts";
import { useDebounce } from "./hooks/useDebounce";
import { useNotifications } from "./hooks/useNotifications";

import { calculateCartTotal } from "./service/cart";

import Layout from "./components/Layout";
import Header from "./components/Layout/Header";
import AdminPage from "./components/admin/AdminPage";
import CartSection from "./components/cart/CartSection";
import ProductListSection from "./components/product/ProductSection";
import NotificationToast from "./components/ui/UIToast";
import { Coupon } from "../types";

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // 관리자 모드 토글 함수
  const handleToggleAdmin = () => {
    setIsAdmin((prev) => !prev);
  };

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

  // 디바운스된 검색어
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // 필터링된 상품 목록
  const filteredProducts = debouncedSearchTerm
    ? products.filter(
        (product) =>
          product.name
            .toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase()) ||
          (product.description &&
            product.description
              .toLowerCase()
              .includes(debouncedSearchTerm.toLowerCase()))
      )
    : products;

  // 쿠폰 적용
  const applyCoupon = useCallback(
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
  );

  // 주문 완료
  const completeOrder = useCallback(() => {
    const orderNumber = `ORD-${Date.now()}`;
    addNotification(
      `주문이 완료되었습니다. 주문번호: ${orderNumber}`,
      "success"
    );
    clearCart();
    setSelectedCoupon(null);
  }, [addNotification, clearCart]);

  // 장바구니에 상품 추가 (알림 포함)
  const handleAddToCart = useCallback(
    (product: ProductWithUI) => {
      addToCart(product, addNotification);
    },
    [addToCart, addNotification]
  );

  // 수량 업데이트 (알림 포함)
  const handleUpdateQuantity = useCallback(
    (productId: string, newQuantity: number) => {
      updateQuantity(productId, newQuantity, addNotification);
    },
    [updateQuantity, addNotification]
  );

  // 상품 추가 (알림 포함)
  const handleAddProduct = useCallback(
    (newProduct: Omit<ProductWithUI, "id">) => {
      addProduct(newProduct, addNotification);
    },
    [addProduct, addNotification]
  );

  // 상품 수정 (알림 포함)
  const handleUpdateProduct = useCallback(
    (productId: string, updates: Partial<ProductWithUI>) => {
      updateProduct(productId, updates, addNotification);
    },
    [updateProduct, addNotification]
  );

  // 상품 삭제 (알림 포함)
  const handleDeleteProduct = useCallback(
    (productId: string) => {
      removeProduct(productId, addNotification);
    },
    [removeProduct, addNotification]
  );

  // 쿠폰 추가 (알림 포함)
  const handleAddCoupon = useCallback(
    (newCoupon: Coupon) => {
      addCoupon(newCoupon, addNotification);
    },
    [addCoupon, addNotification]
  );

  // 쿠폰 삭제 (알림 포함)
  const handleDeleteCoupon = useCallback(
    (couponCode: string) => {
      removeCoupon(
        couponCode,
        selectedCoupon,
        setSelectedCoupon,
        addNotification
      );
    },
    [removeCoupon, selectedCoupon, addNotification]
  );

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
      {/* 페이지 컨텐츠 */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? (
          <AdminPage
            products={products}
            coupons={coupons}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
            onAddCoupon={handleAddCoupon}
            onDeleteCoupon={handleDeleteCoupon}
            addNotification={addNotification}
          />
        ) : (
          // <div className="">gg</div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <ProductListSection
              products={products}
              filteredProducts={filteredProducts}
              debouncedSearchTerm={debouncedSearchTerm}
              getRemainingStock={getRemainingStock}
              handleAddToCart={handleAddToCart}
              isAdmin={isAdmin}
            />

            <div className="lg:col-span-1">
              <CartSection
                cart={cart}
                coupons={coupons}
                selectedCoupon={selectedCoupon}
                onRemove={removeFromCart}
                onUpdateQuantity={handleUpdateQuantity}
                onApplyCoupon={applyCoupon}
                onCompleteOrder={completeOrder}
              />
            </div>
          </div>
        )}
      </main>
    </Layout>
  );
}

export default App;
