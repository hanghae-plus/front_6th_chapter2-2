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
import {
  NotificationList,
  useDebounceState,
  useLocalStorageState,
  useNotifications
} from "../shared";
import { Header } from "./components";
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

  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [activeTab, setActiveTab] = useState<"products" | "coupons">("products");
  const [showProductForm, setShowProductForm] = useState(false);

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

      <NotificationList notifications={notifications} onRemove={removeNotification} />
    </div>
  );
}
