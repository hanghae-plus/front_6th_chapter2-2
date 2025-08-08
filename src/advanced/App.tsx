import { useState, useEffect } from "react";
import { CartItem, Coupon } from "../types";
import { useLocalStorage, useDebounce } from "./hooks";
import { ProductWithUI } from "../basic/models/product";
import Header from "./components/Header";
import AdminPage from "./pages/AdminPage";
import ShopPage from "./pages/ShopPage";
import { NotificationProvider } from "./contexts/NotificationContext";
import { NotificationContainer } from "./components/NotificationContainer";

// 초기 데이터
const initialProducts: ProductWithUI[] = [
  {
    id: "p1",
    name: "상품1",
    price: 10000,
    stock: 20,
    discounts: [
      { quantity: 10, rate: 0.1 },
      { quantity: 20, rate: 0.2 },
    ],
    description: "최고급 품질의 프리미엄 상품입니다.",
  },
  {
    id: "p2",
    name: "상품2",
    price: 20000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.15 }],
    description: "다양한 기능을 갖춘 실용적인 상품입니다.",
    isRecommended: true,
  },
  {
    id: "p3",
    name: "상품3",
    price: 30000,
    stock: 20,
    discounts: [
      { quantity: 10, rate: 0.2 },
      { quantity: 30, rate: 0.25 },
    ],
    description: "대용량과 고성능을 자랑하는 상품입니다.",
  },
];

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

  const [products, setProducts] = useLocalStorage<ProductWithUI[]>(
    "products",
    initialProducts
  );
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
              products={products}
              coupons={coupons}
              setCoupons={setCoupons}
              setProducts={setProducts}
              setSelectedCoupon={setSelectedCoupon}
            />
          ) : (
            <ShopPage
              products={products}
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
    </NotificationProvider>
  );
};

export default App;
