import { useState, useEffect } from "react";
import { CartItem, Coupon } from "../types";
import { useLocalStorage, useDebounce } from "./hooks";
import Header from "./components/Header";
import AdminPage from "./pages/AdminPage";
import ShopPage from "./pages/ShopPage";
import { NotificationProvider } from "./contexts/NotificationContext";
import { ProductProvider } from "./contexts/ProductContext";
import { NotificationContainer } from "./components/NotificationContainer";

const initialCoupons: Coupon[] = [
  {
    name: "5000원 할인",
    code: "AMOUNT5000",
    discountType: "amount",
    discountValue: 5000,
  },
  {
    name: "10% 할인",
    code: "PERCENT10",
    discountType: "percentage",
    discountValue: 10,
  },
];

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const [cart, setCart] = useLocalStorage<CartItem[]>("cart", []);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const [coupons, setCoupons] = useLocalStorage<Coupon[]>(
    "coupons",
    initialCoupons
  );

  const [totalItemCount, setTotalItemCount] = useState(0);

  useEffect(() => {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    setTotalItemCount(count);
  }, [cart]);

  return (
    <NotificationProvider>
      <ProductProvider>
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
              <AdminPage
                coupons={coupons}
                setCoupons={setCoupons}
                setSelectedCoupon={setSelectedCoupon}
              />
            ) : (
              <ShopPage
                coupons={coupons}
                cart={cart}
                searchTerm={debouncedSearchTerm}
                setCart={setCart}
                setSelectedCoupon={setSelectedCoupon}
                selectedCoupon={selectedCoupon}
              />
            )}
          </main>

          <NotificationContainer />
        </div>
      </ProductProvider>
    </NotificationProvider>
  );
};

export default App;
