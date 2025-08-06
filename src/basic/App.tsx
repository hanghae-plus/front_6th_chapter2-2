import { useState, useCallback } from "react";
import { Coupon } from "../types";
import { ProductWithUI } from "./types";
import { useDebounce } from "./hooks/useDebounce";
import { useNotifications } from "./hooks/useNotifications";
import { useCart } from "./hooks/useCart";
import { useProducts } from "./hooks/useProducts";
import { useCoupons } from "./hooks/useCoupons";
import { calculateCartTotal } from "./service/cartService";
import { NotificationToast } from "./components/toast/NotificationToast";
import { Header } from "./components/layout/Header";
import { CartSection } from "./components/cart/CartSection";
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { ProductCartList } from "./components/card/ProductCartList";

const App = () => {
  // 상태 관리
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // 커스텀 훅들
  const { notifications, addNotification, removeNotification } =
    useNotifications();
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { coupons, addCoupon, deleteCoupon } = useCoupons();
  const {
    cart,
    totalItemCount,
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
      deleteProduct(productId, addNotification);
    },
    [deleteProduct, addNotification]
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
      deleteCoupon(
        couponCode,
        selectedCoupon,
        setSelectedCoupon,
        addNotification
      );
    },
    [deleteCoupon, selectedCoupon, addNotification]
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <NotificationToast
        notifications={notifications}
        onRemove={removeNotification}
      />

      <Header
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        cartLength={cart.length}
        totalItemCount={totalItemCount}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? (
          <AdminDashboard
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
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <section>
                <div className="mb-6 flex justify-between items-center">
                  <h2 className="text-2xl font-semibold text-gray-800">
                    전체 상품
                  </h2>
                  <div className="text-sm text-gray-600">
                    총 {products.length}개 상품
                  </div>
                </div>
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">
                      "{debouncedSearchTerm}"에 대한 검색 결과가 없습니다.
                    </p>
                  </div>
                ) : (
                  <ProductCartList
                    filteredProducts={filteredProducts}
                    getRemainingStock={getRemainingStock}
                    handleAddToCart={handleAddToCart}
                    isAdmin={isAdmin}
                  />
                )}
              </section>
            </div>

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
    </div>
  );
};

export default App;
