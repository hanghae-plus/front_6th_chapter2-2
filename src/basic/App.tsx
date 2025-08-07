import { useState, useEffect } from "react";
import { CartItem, Coupon, Product } from "../types";
import ShopPage from "./____pages/shop/ShopPage";
import AdminPage from "./____pages/admin/AdminPage";
import Layout from "./____pages/Layout";
import NotificationProvider from "./___features/notification/NotificationProvider";
import { useLocalStorage } from "./_shared/utility-hooks/use-local-storage";

const App = () => {
  const [cart, setCart, removeCart] = useLocalStorage<CartItem[]>("cart", []);

  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const [isAdmin, setIsAdmin] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const totalItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    if (cart.length === 0) {
      removeCart();
    }
  }, [cart, removeCart]);

  return (
    <NotificationProvider>
      <Layout
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        cart={cart}
        totalItemCount={totalItemCount}
      >
        {isAdmin ? (
          <AdminPage
            selectedCoupon={selectedCoupon}
            setSelectedCoupon={setSelectedCoupon}
          />
        ) : (
          <ShopPage
            searchTerm={searchTerm}
            cart={cart}
            setCart={setCart}
            selectedCoupon={selectedCoupon}
            setSelectedCoupon={setSelectedCoupon}
          />
        )}
      </Layout>
    </NotificationProvider>
  );
};

export default App;
