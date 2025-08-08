import { useCallback, useEffect, useState } from "react";
import { Product } from "../types";
import { CartIcon, CloseXIcon } from "./components/icons";
import { useCart } from "./hooks/useCart";
import { useCoupon } from "./hooks/useCoupon";
import { useNotification } from "./hooks/useNotification";
import { useProducts } from "./hooks/useProducts";
import { calculateItemTotal } from "./models/cart";
import AdminPage from "./pages/AdminPage";
import CartPage from "./pages/CartPage";
import { formatPrice, isProductSoldOut } from "./utils/formatters";
import { useDebounce } from "./utils/hooks/useDebounce";
import Button from "./components/ui/Button";

export interface ProductWithUI extends Product {
  description?: string;
  isRecommended?: boolean;
}

const SOLD_OUT_TEXT = "SOLD OUT";

const App = () => {
  const { notifications, addNotification, removeNotification } =
    useNotification();

  const { products, addProduct, updateProduct, deleteProduct } =
    useProducts(addNotification);

  const {
    cart,
    selectedCoupon,
    setSelectedCoupon,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    calculateTotal,
    clearCart,
  } = useCart(addNotification);
  const { coupons, addCoupon, deleteCoupon } = useCoupon({
    addNotification,
    selectedCoupon,
    setSelectedCoupon,
  });

  const [isAdmin, setIsAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [totalItemCount, setTotalItemCount] = useState(0);

  const getProductPriceDisplay = (price: number, productId: string): string => {
    if (isProductSoldOut(productId, products, cart)) {
      return SOLD_OUT_TEXT;
    }

    return isAdmin ? `${formatPrice(price)}원` : `₩${formatPrice(price)}`;
  };

  const completeOrder = useCallback(() => {
    const orderNumber = `ORD-${Date.now()}`;

    addNotification(
      `주문이 완료되었습니다. 주문번호: ${orderNumber}`,
      "success"
    );

    clearCart();
  }, [addNotification, clearCart]);

  useEffect(() => {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    setTotalItemCount(count);
  }, [cart]);

  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cart));
    } else {
      localStorage.removeItem("cart");
    }
  }, [cart]);

  return (
    <div className="min-h-screen bg-gray-50">
      {notifications.length > 0 && (
        <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 rounded-md shadow-md text-white flex justify-between items-center ${
                notif.type === "error"
                  ? "bg-red-600"
                  : notif.type === "warning"
                  ? "bg-yellow-600"
                  : "bg-green-600"
              }`}
            >
              <span className="mr-2">{notif.message}</span>
              <button
                onClick={() => removeNotification(notif.id)}
                className="text-white hover:text-gray-200"
              >
                <CloseXIcon className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
      <header className="bg-white shadow-sm sticky top-0 z-40 border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center flex-1">
              <h1 className="text-xl font-semibold text-gray-800">SHOP</h1>
              {/* 검색창 - 안티패턴: 검색 로직이 컴포넌트에 직접 포함 */}
              {!isAdmin && (
                <div className="ml-8 flex-1 max-w-md">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="상품 검색..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              )}
            </div>
            <nav className="flex items-center space-x-4">
              <Button
                onClick={() => setIsAdmin(!isAdmin)}
                variant={isAdmin ? "primary" : "ghost"}
                sizes="md"
              >
                {isAdmin ? "쇼핑몰로 돌아가기" : "관리자 페이지로"}
              </Button>
              {!isAdmin && (
                <div className="relative">
                  <CartIcon className="w-6 h-6 text-gray-700" />
                  {cart.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {totalItemCount}
                    </span>
                  )}
                </div>
              )}
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin && (
          <AdminPage
            products={products}
            coupons={coupons}
            addProduct={addProduct}
            updateProduct={updateProduct}
            deleteProduct={deleteProduct}
            addCoupon={addCoupon}
            deleteCoupon={deleteCoupon}
            addNotification={addNotification}
            getProductPriceDisplay={getProductPriceDisplay}
          />
        )}
        {!isAdmin && (
          <CartPage
            products={products}
            cart={cart}
            selectedCoupon={selectedCoupon}
            debouncedSearchTerm={debouncedSearchTerm}
            coupons={coupons}
            setSelectedCoupon={setSelectedCoupon}
            calculateTotal={calculateTotal}
            getProductPriceDisplay={getProductPriceDisplay}
            addToCart={addToCart}
            removeFromCart={removeFromCart}
            calculateItemTotal={calculateItemTotal}
            updateQuantity={updateQuantity}
            applyCoupon={applyCoupon}
            completeOrder={completeOrder}
          />
        )}
      </main>
    </div>
  );
};

export default App;
