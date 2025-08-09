import { useState } from "react";
import { Coupon } from "../types";

import { AdminPage } from "./pages/AdminPage";
import { ShopPage } from "./pages/ShopPage";

import { Header } from "./components/ui/Header";
import { NotificationList } from "./components/ui/NotificationList";
import { useCart } from "./hooks/useCart";
import { useCoupons } from "./hooks/useCoupons";
import { useNotifications } from "./hooks/useNotifications";
import { useProducts } from "./hooks/useProducts";

export interface Notification {
  id: string;
  message: string;
  type: "error" | "success" | "warning";
}

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  const { notifications, addNotification, setNotifications } =
    useNotifications();

  const {
    products,
    filteredProducts,
    addProduct,
    updateProduct,
    deleteProduct,
  } = useProducts();

  const { coupons, addCoupon, removeCoupon } = useCoupons();

  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const { cart, addToCart, updateCartItemQuantity, removeFromCart, clearCart } =
    useCart();

  return (
    <div className="min-h-screen bg-gray-50">
      <NotificationList
        notifications={notifications}
        setNotifications={setNotifications}
      />
      <Header isAdmin={isAdmin} setIsAdmin={setIsAdmin} cart={cart} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? (
          <AdminPage
            products={products}
            coupons={coupons}
            addNotification={addNotification}
            addProduct={addProduct}
            updateProduct={updateProduct}
            deleteProduct={deleteProduct}
            addCoupon={addCoupon}
            removeCoupon={removeCoupon}
          />
        ) : (
          <ShopPage
            products={products}
            filteredProducts={filteredProducts}
            cart={cart}
            addToCart={addToCart}
            updateCartItemQuantity={updateCartItemQuantity}
            removeFromCart={removeFromCart}
            clearCart={clearCart}
            selectedCoupon={selectedCoupon}
            setSelectedCoupon={setSelectedCoupon}
            addNotification={addNotification}
            coupons={coupons}
          />
        )}
      </main>
    </div>
  );
};

export default App;
