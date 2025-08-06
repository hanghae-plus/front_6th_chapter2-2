import { useEffect, useState } from "react";
import Header from "./components/Header.tsx";
import Notifications from "./components/Notifications.tsx";
import { useCart } from "./hooks/useCart.ts";
import { useCoupons } from "./hooks/useCoupons.ts";
import { useNotification } from "./hooks/useNotification.ts";
import { useProducts } from "./hooks/useProducts.ts";
import PageAdmin from "./pages/admin/PageAdmin.tsx";
import PageCart from "./pages/cart/PageCart.tsx";

const App = () => {
  const { products, setProducts } = useProducts();
  const { coupons, setCoupons, selectedCoupon, setSelectedCoupon } =
    useCoupons();
  const { cart, setCart } = useCart();
  const { notifications, setNotifications, handleNotificationAdd } =
    useNotification();

  const [isAdmin, setIsAdmin] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Notifications
        notifications={notifications}
        setNotifications={setNotifications}
      />

      <Header
        isAdmin={isAdmin}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setIsAdmin={setIsAdmin}
        cart={cart}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? (
          <PageAdmin
            products={products}
            setProducts={setProducts}
            handleNotificationAdd={handleNotificationAdd}
            coupons={coupons}
            setCoupons={setCoupons}
            selectedCoupon={selectedCoupon}
            setSelectedCoupon={setSelectedCoupon}
          />
        ) : (
          <PageCart
            products={products}
            debouncedSearchTerm={debouncedSearchTerm}
            cart={cart}
            coupons={coupons}
            selectedCoupon={selectedCoupon}
            setSelectedCoupon={setSelectedCoupon}
            setCart={setCart}
            handleNotificationAdd={handleNotificationAdd}
          />
        )}
      </main>
    </div>
  );
};

export default App;
