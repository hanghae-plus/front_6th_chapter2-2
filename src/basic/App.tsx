import { Coupon } from "../types";
import { Product } from "./entities/product/types";
import Header from "./app/components/Header";

import { AdminPage } from "./pages/AdminPage";
import { CartPage } from "./pages/CartPage";
import { useState, useCallback } from "react";
import { Notification } from "./entities/notification/ui/Notification";
import {
  NotificationVariant,
  type Notification as NotificationType,
} from "./entities/notification/types";
import { useCartStorage } from "./entities/cart/hooks/useCartStorage";
import { useProductStorage } from "./entities/product/hooks/useProductStorage";
import { useCouponStorage } from "./entities/coupon/hooks/useCouponStorage";
import { calculateStock } from "./entities/product/libs/stock";
import { useProductSearch } from "./features/search-product/hooks/useProductSearch";

const App = () => {
  const { products } = useProductStorage();
  const { cart, setCart, totalItemCount } = useCartStorage();
  const { coupons, setCoupons } = useCouponStorage();
  const { filteredProducts, searchValue, searchTerm, onSearchChange } =
    useProductSearch(products);

  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [notifications, setNotifications] = useState<NotificationType[]>([]);

  const getProductRemainingStock = (product: Product): number => {
    const cartItem = cart.find((item) => item.product.id === product.id);
    const cartQuantity = cartItem?.quantity || 0;
    return calculateStock(product.stock, cartQuantity);
  };

  const addNotification = useCallback(
    (
      message: string,
      variant: NotificationVariant = NotificationVariant.SUCCESS
    ) => {
      const id = Date.now().toString();
      setNotifications((prev) => [...prev, { id, message, variant }]);

      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, 3000);
    },
    []
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Notification
        notifications={notifications}
        onRemoveNotification={(id) =>
          setNotifications((prev) => prev.filter((n) => n.id !== id))
        }
      />
      <Header
        isAdmin={isAdmin}
        onAdminToggle={() => setIsAdmin((prev) => !prev)}
        cartItemCount={totalItemCount}
        searchValue={searchValue}
        onSearchChange={onSearchChange}
      />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? (
          <AdminPage
            coupons={coupons}
            setCoupons={setCoupons}
            addNotification={addNotification}
            getProductRemainingStock={getProductRemainingStock}
          />
        ) : (
          <CartPage
            products={products}
            filteredProducts={filteredProducts}
            searchValue={searchTerm}
            cart={cart}
            setCart={setCart}
            coupons={coupons}
            selectedCoupon={selectedCoupon}
            setSelectedCoupon={setSelectedCoupon}
            addNotification={addNotification}
          />
        )}
      </main>
    </div>
  );
};

export default App;
