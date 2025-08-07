import { Coupon } from "../types";
import Header from "./app/components/Header";

import { useState } from "react";
import { useCartStorage } from "./entities/cart/hooks/useCartStorage";
import { Notification } from "./entities/notification/ui/Notification";
import { useProductStorage } from "./entities/product/hooks/useProductStorage";
import { useProductSearch } from "./features/search-product/hooks/useProductSearch";
import { useNotification } from "./features/show-notification";
import { AdminPage } from "./pages/AdminPage";
import { CartPage } from "./pages/CartPage";

const App = () => {
  const { products } = useProductStorage();
  const { cart, setCart, totalItemCount } = useCartStorage();

  const { filteredProducts, searchValue, searchTerm, onSearchChange } =
    useProductSearch(products);

  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const { notifications, removeNotification } = useNotification();

  return (
    <div className="min-h-screen bg-gray-50">
      <Notification
        notifications={notifications}
        onRemoveNotification={removeNotification}
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
          <AdminPage />
        ) : (
          <CartPage
            products={products}
            filteredProducts={filteredProducts}
            searchValue={searchTerm}
            cart={cart}
            setCart={setCart}
            selectedCoupon={selectedCoupon}
            setSelectedCoupon={setSelectedCoupon}
          />
        )}
      </main>
    </div>
  );
};

export default App;
