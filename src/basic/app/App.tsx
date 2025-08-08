import { useEffect, useState } from "react";

import {
  calculateCartTotal,
  calculateItemTotal,
  cartApplicationService,
  type CartItem,
  getRemainingStock
} from "../domains/cart";
import { type Coupon, couponApplicationService, INITIAL_COUPONS } from "../domains/coupon";
import {
  formatPrice,
  INITIAL_PRODUCTS,
  type Product,
  type ProductWithUI
} from "../domains/product";
import { useDebounceState, useLocalStorageState, useNotifications, useToggle } from "../shared";
import { Header, NotificationList } from "./components";
import { AdminPage, CartPage } from "./pages";

export function App() {
  const [products, setProducts] = useLocalStorageState<ProductWithUI[]>({
    key: "products",
    initialState: INITIAL_PRODUCTS
  });

  const [cart, setCart] = useLocalStorageState<CartItem[]>({
    key: "cart",
    initialState: []
  });

  const [coupons, setCoupons] = useLocalStorageState<Coupon[]>({
    key: "coupons",
    initialState: INITIAL_COUPONS
  });

  const [searchTerm, setSearchTerm, debouncedSearchTerm] = useDebounceState({
    delay: 500,
    initialValue: ""
  });

  const { notifications, addNotification, removeNotification } = useNotifications();

  const [isAdminMode, toggleAdminMode] = useToggle(false);

  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const formatPriceWithContext = (price: number, productId?: string) => {
    return formatPrice(price, productId, products, cart, isAdminMode);
  };

  const [totalItemCount, setTotalItemCount] = useState(0);

  const addToCart = (product: Product) => {
    cartApplicationService.addToCart(product, cart, setCart, addNotification);
  };

  const removeFromCart = (productId: string) => {
    cartApplicationService.removeFromCart(productId, setCart);
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    cartApplicationService.updateQuantity(
      productId,
      newQuantity,
      products,
      setCart,
      addNotification
    );
  };

  const completeOrder = () => {
    cartApplicationService.completeOrder(
      () => setCart([]),
      () => setSelectedCoupon(null),
      addNotification
    );
  };

  const applyCoupon = (coupon: Coupon) => {
    const currentTotal = calculateCartTotal(cart, selectedCoupon).totalAfterDiscount;
    couponApplicationService.applyCoupon(coupon, currentTotal, setSelectedCoupon, addNotification);
  };

  const calculateItemTotalWithCart = (item: CartItem) => {
    return calculateItemTotal(item, cart);
  };

  const getRemainingStockWithCart = (product: Product) => {
    return getRemainingStock(product, cart);
  };

  useEffect(() => {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    setTotalItemCount(count);
  }, [cart]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        isAdminMode={isAdminMode}
        onToggleAdminMode={toggleAdminMode}
        cart={cart}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        totalItemCount={totalItemCount}
      />
      <main className="mx-auto max-w-7xl px-4 py-8">
        {isAdminMode ? (
          <AdminPage
            products={products}
            setProducts={setProducts}
            coupons={coupons}
            setCoupons={setCoupons}
            cart={cart}
            isAdminMode={isAdminMode}
            addNotification={addNotification}
          />
        ) : (
          <CartPage
            addToCart={addToCart}
            applyCoupon={applyCoupon}
            calculateItemTotal={calculateItemTotalWithCart}
            cart={cart}
            completeOrder={completeOrder}
            coupons={coupons}
            debouncedSearchTerm={debouncedSearchTerm}
            formatPrice={formatPriceWithContext}
            getRemainingStock={getRemainingStockWithCart}
            products={products}
            removeFromCart={removeFromCart}
            selectedCoupon={selectedCoupon}
            setSelectedCoupon={setSelectedCoupon}
            updateQuantity={updateQuantity}
          />
        )}
      </main>
      <NotificationList notifications={notifications} onRemove={removeNotification} />
    </div>
  );
}
