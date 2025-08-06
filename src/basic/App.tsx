import { useState, useCallback, useEffect } from "react";
import { CartItem, Coupon } from "../types";
import { formatPrice } from "./utils/formatters";
import { ProductWithUI } from "./entities/products/product.types";

import { useProducts } from "./entities/products/useProducts";
import { useNotifications } from "./hooks/useNotifications";
import { useCart } from "./entities/cart/useCart";
import { calculateRemainingStock } from "./utils/calculateRemainingStock";
import { useCoupon } from "./entities/coupon/useCoupon";
import { useProductForm } from "./entities/products/useProductForm";
import { calculateCartTotal } from "./utils/calculateCartTotal";
import { calculateItemTotal } from "./utils/calculateItemTotal";
import { useDebounce } from "./utils/hooks/useDebounce";
import { Header } from "./components/layouts/Header";
import { useSearchProduct } from "./hooks/useSearchProduct";
import { Layout } from "./components/layouts/Layout";
import { Body } from "./components/layouts/Body";
import { AdminPage } from "./pages/AdminPage";
import { CartPage } from "./pages/CartPage";
import { NotificationComponent } from "./components/ui/notification/Notification";

const App = () => {
  const { notifications, setNotifications, addNotification } =
    useNotifications();
  const { products, setProducts, addProduct, updateProduct, deleteProduct } =
    useProducts(addNotification);

  const {
    cart,
    setCart,
    addToCart: addToCartAction,
    removeFromCart,
    updateQuantity: updateQuantityAction,
    totalItemCount,
  } = useCart();

  const {
    coupons,
    setCoupons,
    addCoupon,
    deleteCoupon,
    selectedCoupon,
    setSelectedCoupon,
    applyCoupon,
    couponForm,
    setCouponForm,
  } = useCoupon(addNotification);

  const [isAdmin, setIsAdmin] = useState(false);

  const [showCouponForm, setShowCouponForm] = useState(false);
  const [activeTab, setActiveTab] = useState<"products" | "coupons">(
    "products"
  );
  const {
    productForm,
    setProductForm,
    editingProduct,
    setEditingProduct,
    showProductForm,
    setShowProductForm,
    startEditProduct,
  } = useProductForm();

  const { searchTerm, handleSearch, debouncedSearchTerm } = useSearchProduct();

  const checkSoldOutByProductId = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (product && calculateRemainingStock(product, cart) <= 0) {
      return true;
    }
    return false;
  };

  // 장바구니에 상품 추가 핸들러
  const addToCart = useCallback(
    (product: ProductWithUI) => {
      const result = addToCartAction(product);
      if (result.type) {
        addNotification(result.message, result.type);
      }
    },
    [addToCartAction, addNotification]
  );

  // 수량 변경 핸들러
  const updateQuantity = useCallback(
    (productId: string, newQuantity: number) => {
      const result = updateQuantityAction(productId, newQuantity);
      if (result.type) {
        addNotification(result.message, result.type);
      }
    },
    [updateQuantityAction, addNotification]
  );

  const completeOrder = useCallback(() => {
    const orderNumber = `ORD-${Date.now()}`;
    addNotification(
      `주문이 완료되었습니다. 주문번호: ${orderNumber}`,
      "success"
    );
    setCart([]);
    setSelectedCoupon(null);
  }, [addNotification]);

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct && editingProduct !== "new") {
      updateProduct(editingProduct, productForm);
      setEditingProduct(null);
    } else {
      addProduct({
        ...productForm,
        discounts: productForm.discounts,
      });
    }
    setProductForm({
      name: "",
      price: 0,
      stock: 0,
      description: "",
      discounts: [],
    });
    setEditingProduct(null);
    setShowProductForm(false);
  };

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCoupon(couponForm);
    setCouponForm({
      name: "",
      code: "",
      discountType: "amount",
      discountValue: 0,
    });
    setShowCouponForm(false);
  };

  const totals = calculateCartTotal(cart, selectedCoupon);

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
