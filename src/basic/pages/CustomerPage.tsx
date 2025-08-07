import { Dispatch, SetStateAction, useCallback } from "react";
import { CartItem, Coupon } from "../../types";
import { CartSidebar } from "../components/customer/cart/CartSidebar";
import { ProductGrid } from "../components/customer/product/ProductGrid";
import { useNotification } from "../hooks/useNotification";
import { useProductSearch } from "../hooks/useProductSearch";
import { ProductWithUI } from "../types/product";
import { generateOrderNumber } from "../utils/orderUtils";

interface CustomerPageProps {
  isAdmin: boolean;
  products: ProductWithUI[];
  cart: CartItem[];
  setCart: Dispatch<SetStateAction<CartItem[]>>;
  debouncedSearchTerm: string;
  addToCart: (product: ProductWithUI) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  getRemainingStock: (product: ProductWithUI) => number;
  calculateItemTotal: (item: CartItem) => number;
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  applyCoupon: (coupon: Coupon) => void;
  setSelectedCoupon: (coupon: Coupon | null) => void;
  totals: { totalBeforeDiscount: number; totalAfterDiscount: number };
}

export const CustomerPage = ({
  isAdmin,
  products,
  cart,
  setCart,
  debouncedSearchTerm,
  addToCart,
  removeFromCart,
  updateCartQuantity,
  getRemainingStock,
  calculateItemTotal,
  coupons,
  selectedCoupon,
  applyCoupon,
  setSelectedCoupon,
  totals,
}: CustomerPageProps) => {
  /** 알림 표시 */
  const { showToast } = useNotification();

  /** 상품 필터링 */
  const filteredProducts = useProductSearch({
    products,
    searchTerm: debouncedSearchTerm,
  });

  /** 주문 완료 */
  const completeOrder = useCallback(() => {
    const orderNumber = generateOrderNumber();
    showToast(`주문이 완료되었습니다. 주문번호: ${orderNumber}`, "success");
    setCart([]);
    setSelectedCoupon(null);
  }, [showToast, setCart, setSelectedCoupon]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        <ProductGrid products={products} filteredProducts={filteredProducts} debouncedSearchTerm={debouncedSearchTerm} isAdmin={isAdmin} getRemainingStock={getRemainingStock} addToCart={addToCart} />
      </div>
      <div className="lg:col-span-1">
        <CartSidebar
          cart={cart}
          coupons={coupons}
          selectedCoupon={selectedCoupon}
          totals={totals}
          calculateItemTotal={calculateItemTotal}
          removeFromCart={removeFromCart}
          updateCartQuantity={updateCartQuantity}
          applyCoupon={applyCoupon}
          setSelectedCoupon={setSelectedCoupon}
          completeOrder={completeOrder}
        />
      </div>
    </div>
  );
};
