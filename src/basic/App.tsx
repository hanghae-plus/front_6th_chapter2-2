import { useCallback, useEffect, useState } from "react";
import { CartItem, Coupon, Product } from "../types";
import { getRemainingStock } from "./entities/Product";
import { useLocalStorage } from "./utils/hooks/useLocalStorage";
import { initialProducts } from "./data/products.ts";
import { initialCoupons } from "./data/coupons.ts";
import Notifications from "./components/Notifications.tsx";
import Header from "./components/Header.tsx";
import PageAdmin from "./PageAdmin.tsx";
import { ProductWithUI } from "./ProductWithUI.tsx";
import PageCart from "./PageCart.tsx";

interface Notification {
  id: string;
  message: string;
  type: "error" | "success" | "warning";
}

const App = () => {
  const [products, setProducts] = useLocalStorage<ProductWithUI[]>(
    "products",
    initialProducts
  );
  const [coupons, setCoupons] = useLocalStorage<Coupon[]>(
    "coupons",
    initialCoupons
  );
  const [cart, setCart] = useLocalStorage<CartItem[]>("cart", [], {
    removeWhenEmpty: true,
  });

  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

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

  const handleNotificationAdd = useCallback(
    (message: string, type: "error" | "success" | "warning" = "success") => {
      const id = Date.now().toString();
      setNotifications((prev) => [...prev, { id, message, type }]);

      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, 3000);
    },
    []
  );

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
            formatPrice={formatPrice}
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
            formatPrice={formatPrice}
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
