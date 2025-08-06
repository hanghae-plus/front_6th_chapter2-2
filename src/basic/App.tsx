import { Coupon } from "../types";
import { Product } from "./entities/product/types";
import Header from "./app/components/Header";

import { AdminPage } from "./pages/AdminPage";
import { CartPage } from "./pages/CartPage";
import { useState } from "react";
import { Notification } from "./entities/notification/ui/Notification";
import { useNotification } from "./features/show-notification";
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
  const { notifications, addNotification, removeNotification } =
    useNotification();

  const getProductRemainingStock = (product: Product): number => {
    const cartItem = cart.find((item) => item.product.id === product.id);
    const cartQuantity = cartItem?.quantity || 0;
    return calculateStock(product.stock, cartQuantity);
  };

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
