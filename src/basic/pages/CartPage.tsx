import { useCallback } from "react";
import { ICartItem, ICoupon, IProductWithUI } from "../type";
import { MESSAGES } from "../constants/messages";
import ProductList from "../components/ProductList";
import OrderSummary from "../components/OrderSummary";
import CartList from "../components/CartList";
import CouponSelector from "../components/CouponSelector";
import { ORDER } from "../constants/business";

interface CartPageProps {
  // product
  products: IProductWithUI[];
  getRemainingStock: (product: IProductWithUI) => number;
  updateQuantity: (productId: string, newQuantity: number) => void;
  addToCart: (product: IProductWithUI) => void;
  removeFromCart: (productId: string) => void;

  // cart
  cart: ICartItem[];
  cartTotalPrice: { totalBeforeDiscount: number; totalAfterDiscount: number };
  calculateItemTotal: (item: ICartItem) => number;
  clearCart: () => void;

  // coupons
  coupons: ICoupon[];
  selectedCoupon: ICoupon | null;
  setSelectedCoupon: (value: React.SetStateAction<ICoupon | null>) => void;

  // search
  debouncedSearchTerm?: string;

  // notification
  addNotification: (
    message: string,
    type?: "error" | "success" | "warning"
  ) => void;
}

const CartPage = ({
  products,
  getRemainingStock,
  updateQuantity,
  addToCart,
  removeFromCart,
  cart,
  cartTotalPrice,
  calculateItemTotal,
  clearCart,
  coupons,
  selectedCoupon,
  setSelectedCoupon,
  debouncedSearchTerm,
  addNotification,
}: CartPageProps) => {
  // 장바구니 담기 버튼 처리
  const addItemToCart = useCallback(
    (product: IProductWithUI) => {
      const remainingStock = getRemainingStock(product);
      if (remainingStock <= 0) {
        addNotification(MESSAGES.PRODUCT.OUT_OF_STOCK, "error");
        return;
      }

      addToCart(product);
      addNotification(MESSAGES.PRODUCT.ADDED_TO_CART, "success");
    },
    [cart, addNotification, getRemainingStock]
  );

  // 장바구니의 상품 수 업데이트 (-1, +1 처리)
  const updateItemQuantity = useCallback(
    (productId: string, newQuantity: number) => {
      if (newQuantity <= 0) {
        removeItemFromCart(productId);
        return;
      }

      const product = products.find((p) => p.id === productId);
      if (!product) return;

      const maxStock = product.stock;
      if (newQuantity > maxStock) {
        addNotification(MESSAGES.PRODUCT.MAX_STOCK(maxStock));
        return;
      }

      updateQuantity(productId, newQuantity);
    },
    [products, addNotification, getRemainingStock]
  );

  // 장바구니에서 상품 제거
  const removeItemFromCart = useCallback((productId: string) => {
    removeFromCart(productId);
  }, []);

  // 쿠폰 적용 함수
  const applyCoupon = useCallback(
    (coupon: ICoupon) => {
      // 할인 적용 전 총 가격
      const currentTotal = cartTotalPrice.totalAfterDiscount;

      // 총 가격 10000원 이하일 경우 처리
      if (
        currentTotal < ORDER.MIN_FOR_COUPON &&
        coupon.discountType === "percentage"
      ) {
        addNotification(MESSAGES.COUPON.MIN_PRICE, "error");
        return;
      }

      // 쿠폰 적용 후 알림 처리
      setSelectedCoupon(coupon);
      addNotification(MESSAGES.COUPON.APPLIED, "success");
    },
    [addNotification, cartTotalPrice]
  );

  // 주문 완료 처리 함수
  const completeOrder = useCallback(() => {
    const orderNumber = `ORD-${Date.now()}`;
    addNotification(MESSAGES.ORDER.COMPLETED(orderNumber), "success");
    clearCart();
    setSelectedCoupon(null);
  }, [addNotification]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        {/* 상품 목록 */}
        <ProductList
          products={products}
          addItemToCart={addItemToCart}
          getRemainingStock={getRemainingStock}
          debouncedSearchTerm={debouncedSearchTerm}
        />
      </div>

      {/* 장바구니 + 결제 정보 컨테이너 */}
      <div className="lg:col-span-1">
        <div className="sticky top-24 space-y-4">
          {/* 장바구니 */}
          <CartList
            cart={cart}
            calculateItemTotal={calculateItemTotal}
            removeItemFromCart={removeItemFromCart}
            updateItemQuantity={updateItemQuantity}
          />

          {cart.length > 0 && (
            <>
              {/* 쿠폰 선택 */}
              <CouponSelector
                coupons={coupons}
                selectedCoupon={selectedCoupon}
                setSelectedCoupon={setSelectedCoupon}
                applyCoupon={applyCoupon}
              />

              {/* 결제 정보 */}
              <OrderSummary
                cartTotalPrice={cartTotalPrice}
                completeOrder={completeOrder}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartPage;
