import { Coupon, DiscountType } from "../types";
import { Product } from "./entities/product/types";
import Header from "./app/components/Header";
import { useSearch } from "./shared/hooks/useSearch";
import { AdminPage } from "./pages/AdminPage";
import { CartPage } from "./pages/CartPage";
import { useLocalStorageObject } from "./shared/hooks/useLocalStorage";
import { useState, useCallback } from "react";
import { Notification } from "./entities/notification/ui/Notification";
import {
  NotificationVariant,
  type Notification as NotificationType,
} from "./entities/notification/types";
import { useCartStorage } from "./entities/cart/hooks/useCartStorage";
import { useProductStorage } from "./entities/product/hooks/useProductStorage";
import { getRemainingStock } from "./features/check-stock/libs";

const initialCoupons: Coupon[] = [
  {
    name: "5000원 할인",
    code: "AMOUNT5000",
    discountType: DiscountType.AMOUNT,
    discountValue: 5000,
  },
  {
    name: "10% 할인",
    code: "PERCENT10",
    discountType: DiscountType.PERCENTAGE,
    discountValue: 10,
  },
];

const App = () => {
  const search = useSearch();
  const { products, setProducts } = useProductStorage();
  const { cart, setCart, totalItemCount } = useCartStorage();
  const [coupons, setCoupons] = useLocalStorageObject<Coupon[]>(
    "coupons",
    initialCoupons
  );

  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [notifications, setNotifications] = useState<NotificationType[]>([]);

  const getProductRemainingStock = (product: Product): number => {
    const cartItem = cart.find((item) => item.product.id === product.id);
    const cartQuantity = cartItem?.quantity || 0;
    return getRemainingStock(product, cartQuantity);
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

  const filteredProducts = search.debouncedValue
    ? products.filter(
        (product) =>
          product.name
            .toLowerCase()
            .includes(search.debouncedValue.toLowerCase()) ||
          (product.description &&
            product.description
              .toLowerCase()
              .includes(search.debouncedValue.toLowerCase()))
      )
    : products;

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
        searchTerm={search.debouncedValue}
        onSearchChange={search.change}
      />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? (
          <AdminPage
            products={products}
            setProducts={setProducts}
            coupons={coupons}
            setCoupons={setCoupons}
            addNotification={addNotification}
            getProductRemainingStock={getProductRemainingStock}
          />
        ) : (
          <CartPage
            products={products}
            filteredProducts={filteredProducts}
            searchValue={search.debouncedValue}
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
