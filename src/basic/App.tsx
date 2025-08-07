import { useState } from "react";
import { Coupon } from "../types";
import { CartPage } from "./components/CartPage";
import { AdminPage } from "./components/AdminPage";
import { initialProducts, initialCoupons } from "./constants";
import { useCart } from "./hooks/useCart";
import { useCoupons } from "./hooks/useCoupons";
import { useProducts } from "./hooks/useProducts";
import { useNotifications } from "./hooks/useNotifications";
import { createEmptyCouponForm } from "./models/coupon";
import { useLocalStorage } from "./utils/hooks/useLocalStorage";
import { useDebounce } from "./utils/hooks/useDebounce";

import { CartIcon } from "./components/icons";
import { ToastContainer } from "./components/ui";

export type NotificationType = "error" | "success" | "warning";

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { notifications, onSuccess, onError, removeNotification } =
    useNotifications();

  const {
    cart,
    cartItemCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    completeOrder,
    getStockForProduct,
    calculateTotal,
  } = useCart();

  const [coupons, setCoupons] = useLocalStorage<Coupon[]>(
    "coupons",
    initialCoupons
  );

  const {
    couponForm,
    setCouponForm,
    showCouponForm,
    setShowCouponForm,
    addCoupon,
    deleteCoupon,
    selectedCoupon,
    setSelectedCoupon,
    applyCoupon,
  } = useCoupons({
    coupons,
    onUpdateCoupons: setCoupons,
    onSuccess,
    onError,
    cart,
  });

  const {
    products,
    productForm,
    setProductForm,
    editingProduct,
    setEditingProduct,
    addProduct,
    updateProduct,
    deleteProduct,
    startEditProduct,
    handleDiscountAdd,
    handleDiscountRemove,
    handleDiscountQuantityChange,
    handleDiscountRateChange,
  } = useProducts(initialProducts, onSuccess);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <>
      <ToastContainer
        notifications={notifications}
        onRemoveNotification={removeNotification}
      />

      <header className="bg-white shadow-sm sticky top-0 z-40 border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center flex-1">
              <h1 className="text-xl font-semibold text-gray-800">SHOP</h1>
              {!isAdmin && (
                <div className="ml-8 flex-1 max-w-md">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="상품 검색..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              )}
            </div>
            <nav className="flex items-center space-x-4">
              <button
                onClick={() => setIsAdmin(!isAdmin)}
                className={`px-3 py-1.5 text-sm rounded transition-colors ${
                  isAdmin
                    ? "bg-gray-800 text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {isAdmin ? "쇼핑몰로 돌아가기" : "관리자 페이지로"}
              </button>
              {!isAdmin && (
                <div className="relative">
                  <CartIcon className="w-6 h-6 text-gray-700" />
                  {cart.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </div>
              )}
            </nav>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? (
          <AdminPage
            products={products}
            coupons={coupons}
            couponForm={couponForm}
            setCouponForm={setCouponForm}
            showCouponForm={showCouponForm}
            setShowCouponForm={setShowCouponForm}
            addCoupon={addCoupon}
            deleteCoupon={deleteCoupon}
            onError={onError}
            emptyCouponForm={createEmptyCouponForm()}
            productForm={productForm}
            setProductForm={setProductForm}
            editingProduct={editingProduct}
            setEditingProduct={setEditingProduct}
            addProduct={addProduct}
            updateProduct={updateProduct}
            deleteProduct={deleteProduct}
            startEditProduct={startEditProduct}
            handleDiscountAdd={handleDiscountAdd}
            handleDiscountRemove={handleDiscountRemove}
            handleDiscountQuantityChange={handleDiscountQuantityChange}
            handleDiscountRateChange={handleDiscountRateChange}
          />
        ) : (
          <CartPage
            products={products}
            coupons={coupons}
            debouncedSearchTerm={debouncedSearchTerm}
            onSuccess={onSuccess}
            onError={onError}
            cart={cart}
            selectedCoupon={selectedCoupon}
            setSelectedCoupon={setSelectedCoupon}
            addToCart={addToCart}
            removeFromCart={removeFromCart}
            updateQuantity={updateQuantity}
            applyCoupon={applyCoupon}
            completeOrder={completeOrder}
            getStockForProduct={getStockForProduct}
            calculateTotal={calculateTotal}
          />
        )}
      </main>
    </>
  );
};

export default App;
