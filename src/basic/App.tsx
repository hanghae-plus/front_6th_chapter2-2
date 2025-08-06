import { useState, useEffect } from "react";
import { CartItem, Coupon, Product } from "../types";
import ShopPage from "./____pages/shop/ShopPage";
import AdminPage from "./____pages/admin/AdminPage";
import Layout from "./____pages/Layout";
import NotificationProvider from "./___features/notification/NotificationProvider";
import { useLocalStorage } from "./_shared/utility-hooks/use-local-storage";

interface ProductWithUI extends Product {
  description?: string;
  isRecommended?: boolean;
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

const App = () => {
  const [products, setProducts] = useLocalStorage<ProductWithUI[]>(
    "products",
    initialProducts
  );

  const [cart, setCart, removeCart] = useLocalStorage<CartItem[]>("cart", []);

  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const [isAdmin, setIsAdmin] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const totalItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    if (cart.length === 0) {
      removeCart();
    }
  }, [cart, removeCart]);

  return (
    <NotificationProvider>
      <Layout
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        cart={cart}
        totalItemCount={totalItemCount}
      >
        {isAdmin ? (
          <AdminPage
            products={products}
            setProducts={(value) => setProducts(value)}
            selectedCoupon={selectedCoupon}
            setSelectedCoupon={setSelectedCoupon}
          />
        ) : (
          <ShopPage
            searchTerm={searchTerm}
            products={products}
            cart={cart}
            setCart={setCart}
            selectedCoupon={selectedCoupon}
            setSelectedCoupon={setSelectedCoupon}
          />
        )}
      </Layout>
    </NotificationProvider>
  );
};

export default App;
