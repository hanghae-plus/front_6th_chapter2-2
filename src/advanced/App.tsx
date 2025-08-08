import { useState, useCallback, useEffect } from "react";
import { Notification, ProductWithUI } from "./types/notification";
import Admin from "./components/Admin";
import User from "./components/User";
import Header from "./components/Header";
import { useProducts } from "./hooks/useProduct";
import { useCart } from "./hooks/useCart";
import { useCoupon } from "./hooks/useCoupon";
import { calculateCartTotal } from "./models/cart";
import { useDebounce } from "./utils/hooks/useDebounce";
import { useAtom } from "jotai";
import {
  couponFormAtom,
  editingProductAtom,
  isAdminAtom,
  productFormAtom,
  searchTermAtom,
  selectedCouponAtom,
  showCouponFormAtom,
  showProductFormAtom,
  totalItemCountAtom,
} from "./state";

const App = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback(
    (message: string, type: "error" | "success" | "warning" = "success") => {
      const id = Date.now().toString();
      setNotifications(prev => [...prev, { id, message, type }]);

      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }, 3000);
    },
    []
  );

  const { products, addProduct, updateProduct, deleteProduct } =
    useProducts(addNotification);

  const {
    cart,
    setCart,

    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    getRemainingStock,
  } = useCart(addNotification, products);
  const [selectedCoupon, setSelectedCoupon] = useAtom(selectedCouponAtom);
  const { coupons, addCoupon, deleteCoupon } = useCoupon(
    addNotification,
    selectedCoupon,
    setSelectedCoupon
  );

  const [isAdmin] = useAtom(isAdminAtom);
  const [, setShowCouponForm] = useAtom(showCouponFormAtom);

  const [, setShowProductForm] = useAtom(showProductFormAtom);

  const [searchTerm] = useAtom(searchTermAtom);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Admin
  const [editingProduct, setEditingProduct] = useAtom(editingProductAtom);
  const [productForm, setProductForm] = useAtom(productFormAtom);
  const [couponForm, setCouponForm] = useAtom(couponFormAtom);
  const [, setTotalItemCount] = useAtom(totalItemCountAtom);

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

  const formatPrice = (price: number, productId?: string): string => {
    if (productId) {
      const product = products.find(p => p.id === productId);
      if (product && getRemainingStock(product, cart) <= 0) {
        return "SOLD OUT";
      }
    }

    if (isAdmin) {
      return `${price.toLocaleString()}원`;
    }

    return `₩${price.toLocaleString()}`;
  };

  const completeOrder = useCallback(() => {
    const orderNumber = `ORD-${Date.now()}`;
    addNotification(
      `주문이 완료되었습니다. 주문번호: ${orderNumber}`,
      "success"
    );
    setCart([]);
    setSelectedCoupon(null);
  }, [addNotification]);

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct && editingProduct !== "new") {
      updateProduct(editingProduct, productForm);
      setEditingProduct(null);
    } else {
      addProduct({
        ...productForm,
        discounts: productForm.discounts,
      });
    }
    setProductForm({
      name: "",
      price: 0,
      stock: 0,
      description: "",
      discounts: [],
    });
    setEditingProduct(null);
    setShowProductForm(false);
  };

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCoupon(couponForm);
    setCouponForm({
      name: "",
      code: "",
      discountType: "amount",
      discountValue: 0,
    });
    setShowCouponForm(false);
  };

  const startEditProduct = (product: ProductWithUI) => {
    setEditingProduct(product.id);
    setProductForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
      description: product.description || "",
      discounts: product.discounts || [],
    });
    setShowProductForm(true);
  };

  const totals = calculateCartTotal(cart, selectedCoupon);

  const filteredProducts = debouncedSearchTerm
    ? products.filter(
        product =>
          product.name
            .toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase()) ||
          (product.description &&
            product.description
              .toLowerCase()
              .includes(debouncedSearchTerm.toLowerCase()))
      )
    : products;

  return (
    <div className="min-h-screen bg-gray-50">
      {notifications.length > 0 && (
        <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
          {notifications.map(notif => (
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
                onClick={() =>
                  setNotifications(prev => prev.filter(n => n.id !== notif.id))
                }
                className="text-white hover:text-gray-200"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
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
      <Header cart={cart} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? (
          <Admin
            products={products}
            formatPrice={formatPrice}
            startEditProduct={startEditProduct}
            deleteProduct={deleteProduct}
            handleProductSubmit={handleProductSubmit}
            addNotification={addNotification}
            coupons={coupons}
            deleteCoupon={deleteCoupon}
            handleCouponSubmit={handleCouponSubmit}
          />
        ) : (
          <User
            products={products}
            filteredProducts={filteredProducts}
            debouncedSearchTerm={debouncedSearchTerm}
            getRemainingStock={getRemainingStock}
            formatPrice={formatPrice}
            addToCart={addToCart}
            cart={cart}
            removeFromCart={removeFromCart}
            updateQuantity={updateQuantity}
            coupons={coupons}
            applyCoupon={applyCoupon}
            totals={totals}
            completeOrder={completeOrder}
          />
        )}
      </main>
    </div>
  );
};

export default App;
