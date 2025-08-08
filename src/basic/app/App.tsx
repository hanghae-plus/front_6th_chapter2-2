import { useCallback, useEffect, useState } from "react";

import {
  calculateCartTotal,
  calculateItemTotal,
  type CartItem,
  getRemainingStock,
  useCartActions
} from "../domains/cart";
import { type Coupon, INITIAL_COUPONS, useCouponActions } from "../domains/coupon";
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

  const formatPriceWithContext = useCallback(
    (price: number, productId?: string) => {
      return formatPrice(price, productId, products, cart, isAdminMode);
    },
    [products, cart, isAdminMode]
  );

  const [totalItemCount, setTotalItemCount] = useState(0);

  const { addToCart, removeFromCart, updateQuantity, completeOrder } = useCartActions({
    cart,
    products,
    setCart,
    setSelectedCoupon,
    addNotification
  });

  const { applyCoupon: applyCouponBase } = useCouponActions({
    coupons,
    selectedCoupon,
    setCoupons,
    setSelectedCoupon,
    addNotification
  });

  const applyCoupon = useCallback(
    (coupon: Coupon) => {
      const currentTotal = calculateCartTotal(cart, selectedCoupon).totalAfterDiscount;
      applyCouponBase(coupon, currentTotal);
    },
    [applyCouponBase, cart, selectedCoupon]
  );

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
            calculateItemTotal={(item: CartItem) => calculateItemTotal(item, cart)}
            cart={cart}
            completeOrder={completeOrder}
            coupons={coupons}
            debouncedSearchTerm={debouncedSearchTerm}
            formatPrice={formatPriceWithContext}
            getRemainingStock={(product: Product) => getRemainingStock(product, cart)}
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
