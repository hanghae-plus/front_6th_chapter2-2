import { FormEvent, useCallback, useEffect, useState } from "react";

import {
  calculateCartTotal,
  calculateItemTotal,
  type CartItem,
  getRemainingStock,
  useCartActions
} from "../domains/cart";
import { type Coupon, INITIAL_COUPONS, useCouponActions } from "../domains/coupon";
import {
  filterProducts,
  formatPrice,
  INITIAL_PRODUCTS,
  type Product,
  type ProductForm,
  type ProductWithUI,
  useProductActions
} from "../domains/product";
import { Header } from "./components";
import { AdminPage, CartPage } from "./pages";

interface Notification {
  id: string;
  message: string;
  type: "error" | "success" | "warning";
}

export function App() {
  const [products, setProducts] = useState<ProductWithUI[]>(() => {
    const saved = localStorage.getItem("products");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_PRODUCTS;
      }
    }
    return INITIAL_PRODUCTS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("cart");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem("coupons");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_COUPONS;
      }
    }
    return INITIAL_COUPONS;
  });

  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [activeTab, setActiveTab] = useState<"products" | "coupons">("products");
  const [showProductForm, setShowProductForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Admin
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [productForm, setProductForm] = useState<ProductForm>({
    name: "",
    price: 0,
    stock: 0,
    description: "",
    discounts: []
  });

  const [couponForm, setCouponForm] = useState<Coupon>({
    name: "",
    code: "",
    discountType: "amount",
    discountValue: 0
  });

  const formatPriceWithContext = useCallback(
    (price: number, productId?: string) => {
      return formatPrice(price, productId, products, cart, isAdmin);
    },
    [products, cart, isAdmin]
  );

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

  // Cart actions using domain hook
  const { addToCart, removeFromCart, updateQuantity, completeOrder } = useCartActions({
    cart,
    products,
    setCart,
    setSelectedCoupon,
    addNotification
  });

  // Coupon actions using domain hook
  const {
    deleteCoupon,
    applyCoupon: applyCouponBase,
    handleCouponSubmit
  } = useCouponActions({
    coupons,
    selectedCoupon,
    setCoupons,
    setSelectedCoupon,
    addNotification
  });

  // Wrapper for applyCoupon with cart total calculation
  const applyCoupon = useCallback(
    (coupon: Coupon) => {
      const currentTotal = calculateCartTotal(cart, selectedCoupon).totalAfterDiscount;
      applyCouponBase(coupon, currentTotal);
    },
    [applyCouponBase, cart, selectedCoupon]
  );

  // Product actions using domain hook
  const { deleteProduct, handleProductSubmit, startEditProduct } = useProductActions({
    setProducts,
    addNotification
  });

  useEffect(() => {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    setTotalItemCount(count);
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("coupons", JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cart));
    } else {
      localStorage.removeItem("cart");
    }
  }, [cart]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleProductSubmitWrapper = (e: FormEvent) => {
    e.preventDefault();
    handleProductSubmit(
      productForm,
      editingProduct,
      () => setProductForm({ name: "", price: 0, stock: 0, description: "", discounts: [] }),
      setEditingProduct,
      setShowProductForm
    );
  };

  const handleCouponSubmitWrapper = (e: FormEvent) => {
    e.preventDefault();
    handleCouponSubmit(
      couponForm,
      () =>
        setCouponForm({
          name: "",
          code: "",
          discountType: "amount",
          discountValue: 0
        }),
      setShowCouponForm
    );
  };

  const startEditProductWrapper = (product: ProductWithUI) => {
    startEditProduct(product, setEditingProduct, setProductForm, setShowProductForm);
  };

  const totals = calculateCartTotal(cart, selectedCoupon);

  const filteredProducts = filterProducts(products, debouncedSearchTerm);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        cart={cart}
        isAdmin={isAdmin}
        searchTerm={searchTerm}
        setIsAdmin={setIsAdmin}
        setSearchTerm={setSearchTerm}
        totalItemCount={totalItemCount}
      />

      <main className="mx-auto max-w-7xl px-4 py-8">
        {isAdmin ? (
          <AdminPage
            activeTab={activeTab}
            addNotification={addNotification}
            couponForm={couponForm}
            coupons={coupons}
            deleteCoupon={deleteCoupon}
            deleteProduct={deleteProduct}
            editingProduct={editingProduct}
            formatPrice={formatPriceWithContext}
            handleCouponSubmit={handleCouponSubmitWrapper}
            handleProductSubmit={handleProductSubmitWrapper}
            productForm={productForm}
            products={products}
            setActiveTab={setActiveTab}
            setCouponForm={setCouponForm}
            setEditingProduct={setEditingProduct}
            setProductForm={setProductForm}
            setShowCouponForm={setShowCouponForm}
            setShowProductForm={setShowProductForm}
            showCouponForm={showCouponForm}
            showProductForm={showProductForm}
            startEditProduct={startEditProductWrapper}
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
            filteredProducts={filteredProducts}
            formatPrice={formatPriceWithContext}
            getRemainingStock={(product: Product) => getRemainingStock(product, cart)}
            products={products}
            removeFromCart={removeFromCart}
            selectedCoupon={selectedCoupon}
            setSelectedCoupon={setSelectedCoupon}
            totals={totals}
            updateQuantity={updateQuantity}
          />
        )}
      </main>

      {notifications.length > 0 && (
        <div className="fixed right-4 top-20 z-50 max-w-sm space-y-2">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`flex items-center justify-between rounded-md p-4 text-white shadow-md ${
                notif.type === "error"
                  ? "bg-red-600"
                  : notif.type === "warning"
                    ? "bg-yellow-600"
                    : "bg-green-600"
              }`}
            >
              <span className="mr-2">{notif.message}</span>
              <button
                onClick={() => setNotifications((prev) => prev.filter((n) => n.id !== notif.id))}
                className="text-white hover:text-gray-200"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
