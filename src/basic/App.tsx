import { useState, useCallback, useEffect } from "react";
import { Coupon, Notification, ProductWithUI } from "./types";
import { useCart } from "./hooks/useCart";
import { INITIAL_PRODUCTS, INITIAL_COUPONS } from "./constants";
import HeaderLayout from "./components/Header/HeaderLayout";
import ShopHeaderContent from "./components/Header/ShopHeaderContent";
import AdminHeaderContent from "./components/Header/AdminHeaderContent";
import AdminPage from "./components/ui/AdminPage";
import CartPage from "./components/ui/CartPage";
import Toast from "./components/ui/Toast";
import {
  NOTIFICATION_DURATION,
  SEARCH_DEBOUNCE_DELAY,
} from "./constants/system";

const App = () => {
  // ========== 📋 상태 관리 섹션 ==========

  // ========== 🔔 알림 시스템 ==========
  // 알림 메시지 추가 (3초 후 자동 삭제)
  const addNotification = useCallback(
    (message: string, type: "error" | "success" | "warning" = "success") => {
      const id = Date.now().toString();
      setNotifications((prev) => [...prev, { id, message, type }]);

      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, NOTIFICATION_DURATION);
    },
    []
  );

  // 🛒 장바구니 관리 (useCart 훅 사용 - 최종: 완전한 비즈니스 로직 포함)
  const {
    cart,
    selectedCoupon,
    totals,
    getRemainingStock,
    calculateItemTotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    completeOrder,
  } = useCart(addNotification);

  // 📦 상품 상태 (localStorage에서 복원)
  const [products, setProducts] = useState<ProductWithUI[]>(() => {
    const saved = localStorage.getItem("products");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_PRODUCTS;
      }
    }
    return INITIAL_PRODUCTS;
  });

  // 🎫 쿠폰 상태 (localStorage에서 복원)
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem("coupons");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_COUPONS;
      }
    }
    return INITIAL_COUPONS;
  });

  // 🎛️ UI 상태들
  const [isAdmin, setIsAdmin] = useState(false); // 관리자 모드 여부
  const [notifications, setNotifications] = useState<Notification[]>([]); // 알림 메시지들
  const [searchTerm, setSearchTerm] = useState(""); // 검색어
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(""); // 디바운스된 검색어

  // 알림 메시지 제거
  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  // 장바구니 총 아이템 개수 (헤더 뱃지용)
  const [totalItemCount, setTotalItemCount] = useState(0);

  // ========== 🔄 useEffect 훅들 ==========
  // 장바구니 총 개수 계산
  useEffect(() => {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    setTotalItemCount(count);
  }, [cart]);

  // 상품 변경시 localStorage 저장
  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  // 쿠폰 변경시 localStorage 저장
  useEffect(() => {
    localStorage.setItem("coupons", JSON.stringify(coupons));
  }, [coupons]);

  // 검색어 디바운싱
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, SEARCH_DEBOUNCE_DELAY);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // ========== 🔧 관리자 기능들 ==========
  // 새 상품 추가
  const addProduct = useCallback(
    (newProduct: Omit<ProductWithUI, "id">) => {
      const product: ProductWithUI = {
        ...newProduct,
        id: `p${Date.now()}`,
      };
      setProducts((prev) => [...prev, product]);
      addNotification("상품이 추가되었습니다.", "success");
    },
    [addNotification]
  );

  // 상품 정보 수정
  const updateProduct = useCallback(
    (productId: string, updates: Partial<ProductWithUI>) => {
      setProducts((prev) =>
        prev.map((product) =>
          product.id === productId ? { ...product, ...updates } : product
        )
      );
      addNotification("상품이 수정되었습니다.", "success");
    },
    [addNotification]
  );

  // 상품 삭제
  const deleteProduct = useCallback(
    (productId: string) => {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      addNotification("상품이 삭제되었습니다.", "success");
    },
    [addNotification]
  );

  // 새 쿠폰 추가 (중복 코드 확인)
  const addCoupon = useCallback(
    (newCoupon: Coupon) => {
      const existingCoupon = coupons.find((c) => c.code === newCoupon.code);
      if (existingCoupon) {
        addNotification("이미 존재하는 쿠폰 코드입니다.", "error");
        return;
      }
      setCoupons((prev) => [...prev, newCoupon]);
      addNotification("쿠폰이 추가되었습니다.", "success");
    },
    [coupons, addNotification]
  );

  // 쿠폰 삭제 (사용중인 쿠폰도 해제)
  const deleteCoupon = useCallback(
    (couponCode: string) => {
      setCoupons((prev) => prev.filter((c) => c.code !== couponCode));
      if (selectedCoupon?.code === couponCode) {
        applyCoupon(null);
      }
      addNotification("쿠폰이 삭제되었습니다.", "success");
    },
    [selectedCoupon, addNotification, applyCoupon]
  );

  // 검색어로 필터링된 상품 목록
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

  // ========== 🎨 렌더링 섹션 ==========
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 🔔 알림 메시지들 - 화면 우상단에 표시 */}
      <Toast
        notifications={notifications}
        onRemoveNotification={removeNotification}
      />
      <HeaderLayout>
        {isAdmin ? (
          <AdminHeaderContent onToggleContent={() => setIsAdmin(!isAdmin)} />
        ) : (
          <ShopHeaderContent
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onToggleContent={() => setIsAdmin(!isAdmin)}
            cartItemCount={totalItemCount}
          />
        )}
      </HeaderLayout>
      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? (
          <AdminPage
            products={products}
            onAddProduct={addProduct}
            onUpdateProduct={updateProduct}
            onDeleteProduct={deleteProduct}
            getRemainingStock={getRemainingStock}
            coupons={coupons}
            onAddCoupon={addCoupon}
            onDeleteCoupon={deleteCoupon}
            addNotification={addNotification}
          />
        ) : (
          <CartPage
            products={products}
            filteredProducts={filteredProducts}
            debouncedSearchTerm={debouncedSearchTerm}
            getRemainingStock={getRemainingStock}
            onAddToCart={addToCart}
            cart={cart}
            coupons={coupons}
            selectedCoupon={selectedCoupon}
            totals={totals}
            onRemoveFromCart={removeFromCart}
            onUpdateQuantity={(productId: string, newQuantity: number) =>
              updateQuantity(productId, newQuantity, products)
            }
            onApplyCoupon={applyCoupon}
            onCompleteOrder={completeOrder}
            calculateItemTotal={calculateItemTotal}
          />
        )}
      </main>
    </div>
  );
};

export default App;
