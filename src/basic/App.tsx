import { CartItem, Coupon } from "../types";
import { Product } from "./features/product/types";
import Header from "./app/components/Header";
import { useSearch } from "./shared/hooks/useSearch";
import { getRemainingStock } from "./features/product/libs";
import { AdminPage } from "./pages/AdminPage";
import { CartPage } from "./pages/CartPage";
import { useLocalStorageObject } from "./shared/hooks/useLocalStorage";
import { useState, useCallback, useEffect } from "react";
import { Notification } from "./features/notification/components/Notification";

interface ProductWithUI extends Product {
  description?: string;
  isRecommended?: boolean;
}

interface Notification {
  id: string;
  message: string;
  type: "error" | "success" | "warning";
}

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
  const search = useSearch();
  const [products, setProducts] = useLocalStorageObject<ProductWithUI[]>(
    "products",
    initialProducts
  );
  const [cart, setCart] = useLocalStorageObject<CartItem[]>("cart", []);
  const [coupons, setCoupons] = useLocalStorageObject<Coupon[]>(
    "coupons",
    initialCoupons
  );

  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const getProductRemainingStock = (product: Product): number => {
    const cartItem = cart.find((item) => item.product.id === product.id);
    const cartQuantity = cartItem?.quantity || 0;
    return getRemainingStock(product, cartQuantity);
  };

  const addNotification = useCallback(
    (message: string, type: "error" | "success" | "warning" = "success") => {
      const id = Date.now().toString();
      setNotifications((prev) => [...prev, { id, message, type }]);

      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, 3000);
    },
    []
  );

  const [totalItemCount, setTotalItemCount] = useState(0);

  useEffect(() => {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    setTotalItemCount(count);
  }, [cart]);

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
