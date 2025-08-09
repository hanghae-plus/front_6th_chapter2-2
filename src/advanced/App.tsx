import { useState, useEffect } from "react";
import { CartItem } from "../types";
import { useLocalStorage, useDebounce } from "./hooks";
import Header from "./components/Header";
import AdminPage from "./pages/AdminPage";
import ShopPage from "./pages/ShopPage";
import { NotificationProvider } from "./contexts/NotificationContext";
import { ProductProvider } from "./contexts/ProductContext";
import { CouponProvider } from "./contexts/CouponContext";
import { NotificationContainer } from "./components/NotificationContainer";

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const [cart, setCart] = useLocalStorage<CartItem[]>("cart", []);

  const [totalItemCount, setTotalItemCount] = useState(0);

  useEffect(() => {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    setTotalItemCount(count);
  }, [cart]);

  return (
    <NotificationProvider>
      <ProductProvider>
        <CouponProvider>
          <div className="min-h-screen bg-gray-50">
            <Header
              isAdmin={isAdmin}
              onToggleAdmin={() => setIsAdmin(!isAdmin)}
              searchTerm={searchTerm}
              onSearchTerms={(terms) => setSearchTerm(terms)}
              cartCount={totalItemCount}
            />

            <main className="max-w-7xl mx-auto px-4 py-8">
              {isAdmin ? (
                <AdminPage />
              ) : (
                <ShopPage
                  cart={cart}
                  searchTerm={debouncedSearchTerm}
                  setCart={setCart}
                />
              )}
            </main>

            <NotificationContainer />
          </div>
        </CouponProvider>
      </ProductProvider>
    </NotificationProvider>
  );
};

export default App;
