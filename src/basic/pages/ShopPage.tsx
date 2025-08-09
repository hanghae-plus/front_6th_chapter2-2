import { useCallback } from "react";
import { CartItem, Coupon, Product } from "../../types";

import { ProductList } from "../components/product/ProductList";
import { calculateCartTotal, getRemainingStock } from "../utils/cartUtils";
import { CartSection } from "../components/cart/CartSection";
import { CouponSection } from "../components/coupon/CouponSection";
import { PaymentSection } from "../components/payment/PaymentSection";

interface ShopPageProps {
  products: Product[];
  filteredProducts: Product[];

  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  updateCartItemQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  selectedCoupon: Coupon | null;
  setSelectedCoupon: (coupon: Coupon | null) => void;
  addNotification: (
    message: string,
    type: "error" | "success" | "warning"
  ) => void;
  coupons: Coupon[];
}

export function ShopPage({
  products,
  filteredProducts,
  cart,
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart,
  selectedCoupon,
  setSelectedCoupon,
  addNotification,
  coupons,
}: ShopPageProps) {
  // 장바구니 상품 수량 변경 (props로 받은 함수 사용)
  const handleUpdateQuantity = useCallback(
    (product: Product, newQuantity: number) => {
      if (newQuantity <= 0) {
        removeFromCart(product.id);
        return;
      }

      if (newQuantity > product.stock) {
        addNotification?.(`재고는 ${product.stock}개까지만 있습니다.`, "error");
        return;
      }

      if (!getRemainingStock(product, cart)) {
        addNotification("재고가 부족합니다", "error");
        return;
      }

      updateCartItemQuantity(product.id, newQuantity);
    },
    [addNotification, cart, removeFromCart, updateCartItemQuantity]
  );

  // 쿠폰 적용
  const applyCoupon = useCallback(
    (coupon: Coupon) => {
      const currentTotal = calculateCartTotal(
        cart,
        selectedCoupon
      ).totalBeforeDiscount;

      if (currentTotal < 10000 && coupon.discountType === "percentage") {
        addNotification(
          "percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.",
          "error"
        );
        return;
      }

      setSelectedCoupon(coupon);
      addNotification("쿠폰이 적용되었습니다.", "success");
    },
    [addNotification, cart, selectedCoupon, setSelectedCoupon]
  );

  // 주문 완료
  const completeOrder = useCallback(() => {
    const orderNumber = `ORD-${Date.now()}`;
    addNotification(
      `주문이 완료되었습니다. 주문번호: ${orderNumber}`,
      "success"
    );
    clearCart();
    setSelectedCoupon(null);
  }, [addNotification, clearCart, setSelectedCoupon]);

  const totals = calculateCartTotal(cart, selectedCoupon);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        {/* 상품 목록 */}
        <ProductList
          products={products}
          filteredProducts={filteredProducts}
          cart={cart}
          addToCart={addToCart}
          addNotification={addNotification}
        />
      </div>

      <div className="lg:col-span-1">
        <div className="sticky top-24 space-y-4">
          <CartSection
            cart={cart}
            removeFromCart={removeFromCart}
            handleUpdateQuantity={handleUpdateQuantity}
          />

          {cart.length > 0 && (
            <>
              <CouponSection
                coupons={coupons}
                selectedCoupon={selectedCoupon}
                setSelectedCoupon={setSelectedCoupon}
                applyCoupon={applyCoupon}
              />

              <PaymentSection totals={totals} completeOrder={completeOrder} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
