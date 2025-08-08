import Header from "./app/components/Header";

import { useState } from "react";
import { NotificationList } from "@entities/notification";
import { useProductStorage } from "@entities/product";
import { useProductSearch } from "@features/search-product";
import { useNotification } from "@features/show-notification";
import { AdminPage } from "./pages/AdminPage";
import { CartPage } from "./pages/CartPage";
import { CartProvider } from "./entities/cart/model/CartProvider";
import { CouponProvider } from "./entities/coupon/model/CouponProvider";

const App = () => {
  const { products } = useProductStorage();

  const { filteredProducts, searchValue, searchTerm, onSearchChange } =
    useProductSearch(products);

  const [isAdmin, setIsAdmin] = useState(false);
  const { notifications, removeNotification } = useNotification();

  return (
    <div className="min-h-screen bg-gray-50">
      <NotificationList
        notifications={notifications}
        onRemoveNotification={removeNotification}
      />
      <CartProvider>
        <Header
          isAdmin={isAdmin}
          onAdminToggle={() => setIsAdmin((prev) => !prev)}
          searchValue={searchValue}
          onSearchChange={onSearchChange}
        />
        <CouponProvider>
          <main className="max-w-7xl mx-auto px-4 py-8">
            {isAdmin ? (
              <AdminPage />
            ) : (
              <CartPage
                products={products}
                filteredProducts={filteredProducts}
                searchValue={searchTerm}
              />
            )}
          </main>
        </CouponProvider>
      </CartProvider>
    </div>
  );
};

export default App;
