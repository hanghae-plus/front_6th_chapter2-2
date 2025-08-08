import { useState, useCallback } from "react";
import { ToastList } from "./components/ui/ToastList";
import { AdminPage } from "./components/AdminPage";
import { ProductPage } from "./components/ProductPage"; // ProductPage import 추가
import { CartPage } from "./components/CartPage"; // CartPage import 추가
import { useCart } from "./hooks/useCart";
import { useProducts } from "./hooks/useProducts";
import { useCoupons } from "./hooks/useCoupons";
import { useDebounce } from "./utils/hooks/useDebounce"; // useDebounce import 추가
import { formatPrice } from "./utils/formatters"; // formatPrice import 추가
import { useNotification } from "./hooks/useNotifications"; // useNotification import 추가
import { Header } from "./components/Header"; // Header 컴포넌트 import

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const { notifications, addNotification, removeNotification } =
    useNotification();
  const [activeTab, setActiveTab] = useState<"products" | "coupons">(
    "products"
  );

  const products = useProducts({
    addNotification,
  });

  const cart = useCart({
    products: products.products,
    addNotification,
  });

  const coupons = useCoupons({
    addNotification,
    selectedCoupon: cart.selectedCoupon,
    setSelectedCoupon: cart.setSelectedCoupon,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const formatPriceWithStock = useCallback(
    (price: number, productId?: string): string => {
      return formatPrice(price, {
        productId,
        products: products.products,
        getRemainingStock: cart.getRemainingStock,
        isAdmin,
      });
    },
    [products.products, cart.getRemainingStock, isAdmin]
  );

  const filteredProducts = debouncedSearchTerm
    ? products.products.filter(
        (product) =>
          product.name
            .toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase()) ||
          (product.description &&
            product.description
              .toLowerCase()
              .includes(debouncedSearchTerm.toLowerCase()))
      )
    : products.products;

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastList
        toasts={notifications}
        onClose={(id) => removeNotification(id)}
      />

      <Header
        isAdmin={isAdmin}
        searchTerm={searchTerm}
        cartItemCount={cart.totalItemCount}
        onToggleAdmin={() => setIsAdmin(!isAdmin)}
        onSearchChange={setSearchTerm}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? (
          <AdminPage
            activeTab={activeTab}
            productsHook={products}
            couponsHook={coupons}
            onTabChange={setActiveTab}
            formatPrice={formatPriceWithStock}
            addNotification={addNotification}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <ProductPage
              products={products.products}
              filteredProducts={filteredProducts}
              debouncedSearchTerm={debouncedSearchTerm}
              onAddToCart={cart.addToCart}
              getRemainingStock={cart.getRemainingStock}
              formatPrice={formatPriceWithStock}
            />

            <CartPage
              cart={cart.cart}
              coupons={coupons.coupons}
              selectedCoupon={cart.selectedCoupon}
              totals={cart.totals}
              onUpdateQuantity={cart.updateQuantity}
              onRemoveFromCart={cart.removeFromCart}
              onApplyCoupon={cart.applyCoupon}
              onSetSelectedCoupon={cart.setSelectedCoupon}
              onCompleteOrder={cart.completeOrder}
              calculateItemTotal={cart.calculateItemTotal}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
