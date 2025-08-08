import { useState } from "react";
import Header from "./components/Header.tsx";
import Notifications from "./components/Notifications.tsx";
import { useCart } from "./hooks/useCart.ts";
import { useCoupons } from "./hooks/useCoupons.ts";
import { useNotification } from "./hooks/useNotification.ts";
import { useProducts } from "./hooks/useProducts.ts";
import PageAdmin from "./pages/admin/PageAdmin.tsx";
import PageCart from "./pages/cart/PageCart.tsx";

// 더 이상적인 세분화화와 폴더구조를 해볼 수 있겠지만 basic은 여기까지만 할게요.
const App = () => {
  const { products, setProducts } = useProducts();
  const { coupons, setCoupons, selectedCoupon, setSelectedCoupon } = useCoupons();
  const { cart, setCart } = useCart();
  const { notifications, setNotifications, handleNotificationAdd } = useNotification();

  const [isAdmin, setIsAdmin] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="min-h-screen bg-gray-50">
      <Notifications notifications={notifications} setNotifications={setNotifications} />

      <Header isAdmin={isAdmin} searchTerm={searchTerm} setSearchTerm={setSearchTerm} setIsAdmin={setIsAdmin} cart={cart} />

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
            searchTerm={searchTerm}
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
