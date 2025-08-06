// hooks
import { useState, useCallback } from "react";
import { useProducts } from "./hooks/useProducts";
import { useCart } from "./hooks/useCart";
import { useCoupons } from "./hooks/useCoupons";
import { useNotification } from "./hooks/useNotification";

// utils
import { useSearch } from "./utils/hooks/useSearch";
import { calculateFinalTotal } from "./utils/calculations";

// components
import { Header } from "./components/ui/header/Header";
import { Notification } from "./components/ui/notification/Notification";

// pages
import AdminPage from "./pages/Admin/AdminPage";
import ShopPage from "./pages/Main/ShopPage/ShopPage";

// type
import { Product } from "../types";

const App = () => {
  // 커스텀 훅 사용
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const {
    cart,
    totalItemCount,
    getRemainingStock,
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
  const [showProductForm, setShowProductForm] = useState(false);

  // Admin
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [productForm, setProductForm] = useState({
    name: "",
    price: 0,
    stock: 0,
    description: "",
    discounts: [] as Array<{ quantity: number; rate: number }>,
  });

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

  // 장바구니에 상품 추가 (에러 처리 포함)
  const addToCart = useCallback(
    (product: Product) => {
      try {
        addToCartHook(product);
        addNotification("장바구니에 담았습니다", "success");
      } catch (error) {
        addNotification(error instanceof Error ? error.message : "오류가 발생했습니다", "error");
      }
    },
    [addToCartHook, addNotification]
  );

  // 수량 업데이트 (에러 처리 포함)
  const handleUpdateQuantity = useCallback(
    (productId: string, newQuantity: number) => {
      try {
        updateQuantity(productId, newQuantity, products);
      } catch (error) {
        addNotification(error instanceof Error ? error.message : "오류가 발생했습니다", "error");
      }
    },
    [updateQuantity, products, addNotification]
  );

  // 쿠폰 적용 (에러 처리 포함)
  const handleApplyCoupon = useCallback(
    (coupon: any) => {
      try {
        const currentTotal = calculateCartTotal().totalAfterDiscount;
        applyCoupon(coupon, currentTotal);
        addNotification("쿠폰이 적용되었습니다.", "success");
      } catch (error) {
        addNotification(error instanceof Error ? error.message : "오류가 발생했습니다", "error");
      }
    },
    [applyCoupon, calculateCartTotal, addNotification]
  );

  // 주문 완료
  const completeOrder = useCallback(() => {
    const orderNumber = `ORD-${Date.now()}`;
    addNotification(`주문이 완료되었습니다. 주문번호: ${orderNumber}`, "success");
    clearCart();
    setSelectedCoupon(null);
  }, [addNotification, clearCart, setSelectedCoupon]);

  // 상품 추가 (에러 처리 포함)
  const handleAddProduct = useCallback(
    (newProduct: Omit<Product, "id">) => {
      try {
        addProduct(newProduct);
        addNotification("상품이 추가되었습니다.", "success");
      } catch (error) {
        addNotification(error instanceof Error ? error.message : "오류가 발생했습니다", "error");
      }
    },
    [addProduct, addNotification]
  );

  // 상품 수정 (에러 처리 포함)
  const handleUpdateProduct = useCallback(
    (productId: string, updates: Partial<Product>) => {
      try {
        updateProduct(productId, updates);
        addNotification("상품이 수정되었습니다.", "success");
      } catch (error) {
        addNotification(error instanceof Error ? error.message : "오류가 발생했습니다", "error");
      }
    },
    [updateProduct, addNotification]
  );

  // 상품 삭제 (에러 처리 포함)
  const handleDeleteProduct = useCallback(
    (productId: string) => {
      try {
        deleteProduct(productId);
        addNotification("상품이 삭제되었습니다.", "success");
      } catch (error) {
        addNotification(error instanceof Error ? error.message : "오류가 발생했습니다", "error");
      }
    },
    [deleteProduct, addNotification]
  );

  // 쿠폰 추가 (에러 처리 포함)
  const handleAddCoupon = useCallback(
    (newCoupon: any) => {
      try {
        addCoupon(newCoupon);
        addNotification("쿠폰이 추가되었습니다.", "success");
      } catch (error) {
        addNotification(error instanceof Error ? error.message : "오류가 발생했습니다", "error");
      }
    },
    [addCoupon, addNotification]
  );

  // 쿠폰 삭제 (에러 처리 포함)
  const handleDeleteCoupon = useCallback(
    (couponCode: string) => {
      try {
        deleteCoupon(couponCode);
        addNotification("쿠폰이 삭제되었습니다.", "success");
      } catch (error) {
        addNotification(error instanceof Error ? error.message : "오류가 발생했습니다", "error");
      }
    },
    [deleteCoupon, addNotification]
  );

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct && editingProduct !== "new") {
      handleUpdateProduct(editingProduct, productForm);
      setEditingProduct(null);
    } else {
      handleAddProduct({
        ...productForm,
        discounts: productForm.discounts,
      });
    }
    setProductForm({ name: "", price: 0, stock: 0, description: "", discounts: [] });
    setEditingProduct(null);
    setShowProductForm(false);
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

  const startEditProduct = (product: Product) => {
    setEditingProduct(product.id);
    setProductForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
      description: product.description || "",
      discounts: product.discounts || [],
    });
    setShowProductForm(true);
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
            onAddProduct={() => {
              setEditingProduct("new");
              setProductForm({ name: "", price: 0, stock: 0, description: "", discounts: [] });
              setShowProductForm(true);
            }}
            showProductForm={showProductForm}
            productForm={productForm}
            setProductForm={setProductForm}
            editingProduct={editingProduct}
            onProductSubmit={handleProductSubmit}
            onCancelProductForm={() => {
              setEditingProduct(null);
              setProductForm({ name: "", price: 0, stock: 0, description: "", discounts: [] });
              setShowProductForm(false);
            }}
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
