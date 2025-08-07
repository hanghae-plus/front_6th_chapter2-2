import { useEffect, useState } from "react";
import { CartItem, Coupon } from "../types";
import { Header } from "./components/common/Header";
import { NotificationToast } from "./components/common/NotificationToast";
import CartPage from "./pages/CartPage";
import AdminPage from "./pages/AdminPage";
import { useLocalStorageState } from "./utils/hooks/useLocalStorageState";
import { useFilteredProducts } from "./utils/hooks/useFilteredProducts";
import { useDebounce } from "./utils/hooks/useDebounce";
import { useProducts } from "./hooks/useProducts";
import { useNotification } from "./hooks/useNotification";
import { useCoupons } from "./hooks/useCoupons";
import { NOTIFICATION_MESSAGE } from "./constants";
import { cartHandler } from "./handlers/cart";

export default function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useLocalStorageState<Array<CartItem>>("cart", []);
  const {
    coupons,
    hasCoupon,
    addCoupon,
    deleteCoupon,
    selectedCoupon,
    setSelectedCoupon,
    applyCoupon,
  } = useCoupons();

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const { notifications, addNotification, removeNotification } =
    useNotification();
  const { products, addProduct, deleteProduct, updateProduct } = useProducts();

  const filteredProducts = useFilteredProducts(products, debouncedSearchTerm);

  const [isAdmin, setIsAdmin] = useState(false);

  const {
    calculateItemTotal,
    calculateCartTotal,
    updateCartItemQuantity,
    getRemainingStock,
    removeFromCart,
  } = cartHandler(cart, selectedCoupon);

  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cart));
    } else {
      localStorage.removeItem("cart");
    }
  }, [cart]);

  const handleDeleteCoupon = (couponCode: string) => {
    deleteCoupon(couponCode);
    addNotification(NOTIFICATION_MESSAGE.COUPON.DELETE, "success");
  };

  const handleAddCoupon = (newCoupon: Coupon) => {
    const isSuccessAddCoupon = addCoupon(newCoupon, hasCoupon(newCoupon.code));
    if (isSuccessAddCoupon) {
      addNotification(NOTIFICATION_MESSAGE.COUPON.ADD, "success");
    } else {
      addNotification(NOTIFICATION_MESSAGE.ERROR.EXISTED_COUPON, "error");
    }
  };

  const handleApplyCoupon = (coupon: Coupon, currentTotal: number) => {
    const canApplyCoupon = applyCoupon(coupon, currentTotal);
    if (canApplyCoupon) {
      addNotification(NOTIFICATION_MESSAGE.COUPON.APPLIED, "success");
    } else {
      addNotification(NOTIFICATION_MESSAGE.ERROR.MIN_COUPON, "error");
    }
  };
  const totals = calculateCartTotal();

  return (
    <div className="min-h-screen bg-gray-50">
      <NotificationToast
        notifications={notifications}
        removeNotification={removeNotification}
      />
      <Header
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
        cart={cart}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? (
          <AdminPage
            products={products}
            coupons={coupons}
            addProduct={addProduct}
            deleteProduct={deleteProduct}
            updateProduct={updateProduct}
            handleAddCoupon={handleAddCoupon}
            handleDeleteCoupon={handleDeleteCoupon}
            addNotification={addNotification}
            getRemainingStock={getRemainingStock}
          />
        ) : (
          <CartPage
            cart={cart}
            setCart={setCart}
            products={products}
            coupons={coupons}
            selectedCoupon={selectedCoupon}
            setSelectedCoupon={setSelectedCoupon}
            filteredProducts={filteredProducts}
            debouncedSearchTerm={debouncedSearchTerm}
            addNotification={addNotification}
            handleApplyCoupon={handleApplyCoupon}
            totals={totals}
            getRemainingStock={getRemainingStock}
            updateCartItemQuantity={updateCartItemQuantity}
            removeFromCart={removeFromCart}
            calculateItemTotal={calculateItemTotal}
          />
        )}
      </main>
    </div>
  );
}
