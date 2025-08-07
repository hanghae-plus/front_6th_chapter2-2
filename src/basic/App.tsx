import { useState, useEffect, useMemo } from "react";
import { Coupon } from "../types";
import { useProducts } from "./hooks/useProducts";
import { useCart } from "./hooks/useCart";
import { useCoupons } from "./hooks/useCoupons";
import { getRemainingStock } from "./models/cart";

import Notification from "./components/Notification";
import { useNotification } from "./hooks/useNotification";
import AdminPage from "./pages/AdminPage";
import CartPage from "./pages/CartPage";
import Header from "./components/Header";

const App = () => {
  const registerProduct = useProducts();
  const products = registerProduct.products;

  const registerCart = useCart();
  const cart = registerCart.cart;

  const registerCoupons = useCoupons();
  const coupons = registerCoupons.coupons;

  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const [searchTerm, setSearchTerm] = useState("");

  const { notifications, addNotification, removeNotification } =
    useNotification();

  /** 뷰 데이터 */
  const [isAdmin, setIsAdmin] = useState(false);

  const togglePage = () => {
    setIsAdmin((isAdmin) => !isAdmin);
  };

  const formatPrice = (price: number, productId?: string): string => {
    if (productId) {
      const product = products.find((p) => p.id === productId);
      if (product && getRemainingStock(product, cart) <= 0) {
        return "SOLD OUT";
      }
    }

    if (isAdmin) {
      return `${price.toLocaleString()}원`;
    }

    return `₩${price.toLocaleString()}`;
  };

  const totalItemCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Notification
        notifications={notifications}
        removeNotification={removeNotification}
      />
      <Header
        isAdmin={isAdmin}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        togglePage={togglePage}
        totalItemCount={totalItemCount}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? (
          <AdminPage
            selectedCoupon={selectedCoupon}
            setSelectedCoupon={setSelectedCoupon}
            addNotification={addNotification}
            registerProduct={registerProduct}
            registerCoupons={registerCoupons}
            formatPrice={formatPrice}
          />
        ) : (
          <CartPage
            products={products}
            searchTerm={searchTerm}
            coupons={coupons}
            addNotification={addNotification}
            registerCart={registerCart}
            selectedCoupon={selectedCoupon}
            setSelectedCoupon={setSelectedCoupon}
            formatPrice={formatPrice}
          />
        )}
      </main>
    </div>
  );
};

export default App;
