import { useState } from "react";
import { Product } from "../types";

import { Header } from "./components/layout/Header.tsx";
import { CartProvider } from "./hooks/useCart.tsx";
import { CouponProvider } from "./hooks/useCoupon.tsx";
import { NotificationProvider } from "./hooks/useNotification.tsx";
import { ProductProvider } from "./hooks/useProducts.tsx";
import { SearchProvider } from "./hooks/useSearch.tsx";
import AdminPage from "./pages/admin/AdminPage.tsx";
import CartPage from "./pages/cart/CartPage.tsx";

export interface ProductWithUI extends Product {
  description?: string;
  isRecommended?: boolean;
}

export const SOLD_OUT_TEXT = "SOLD OUT";

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <NotificationProvider>
      <CartProvider>
        <CouponProvider>
          <ProductProvider>
            <SearchProvider>
              <div className="min-h-screen bg-gray-50">
                <Header
                  isAdmin={isAdmin}
                  handleToggleAdmin={() => setIsAdmin(!isAdmin)}
                />
                <main className="max-w-7xl mx-auto px-4 py-8">
                  {isAdmin && <AdminPage />}
                  {!isAdmin && <CartPage />}
                </main>
              </div>
            </SearchProvider>
          </ProductProvider>
        </CouponProvider>
      </CartProvider>
    </NotificationProvider>
  );
};

export default App;
