// TODO: 장바구니 페이지 컴포넌트
// 힌트:
// 1. 상품 목록 표시 (검색 기능 포함)
// 2. 장바구니 관리
// 3. 쿠폰 적용
// 4. 주문 처리
//
// 필요한 hooks:
// - useProducts: 상품 목록 관리
// - useCart: 장바구니 상태 관리
// - useCoupons: 쿠폰 목록 관리
// - useDebounce: 검색어 디바운싱
//
// 하위 컴포넌트:
// - SearchBar: 검색 입력
// - ProductList: 상품 목록 표시

import { ProductList } from "./cart/ProductList";
import { Cart } from "./cart/Cart";
import { CouponSelector } from "./cart/CouponSelector";
import { OrderSummary } from "./cart/OrderSummary";
import { ProductWithUI, Coupon, CartItem } from "../type/types";

interface CartPageProps {
  isAdmin: boolean;
  searchTerm: string;
  products: ProductWithUI[];
  coupons: Coupon[];
  cart: CartItem[];
  selectedCoupon: Coupon | null;
  addToCart: (product: ProductWithUI) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, newQuantity: number) => void;
  applyCoupon: (coupon: Coupon) => void;
  removeSelectedCoupon: () => void;
  completeOrder: () => void;
  calculateItemTotal: (item: CartItem) => number;
  calculateCartTotal: () => {
    totalBeforeDiscount: number;
    totalAfterDiscount: number;
  };
  getRemainingStock: (product: ProductWithUI) => number;
}

/**
 * 장바구니 페이지 컴포넌트
 *
 * 주요 기능:
 * 1. 상품 목록 표시 (검색 기능 포함)
 * 2. 장바구니 관리
 * 3. 쿠폰 적용
 * 4. 주문 처리
 *
 * Props로 모든 상태와 함수를 받아서 사용 (Props Drilling 방식)
 */
export function CartPage({
  isAdmin,
  searchTerm,
  products,
  coupons,
  cart,
  selectedCoupon,
  addToCart,
  removeFromCart,
  updateQuantity,
  applyCoupon,
  removeSelectedCoupon,
  completeOrder,
  calculateItemTotal,
  calculateCartTotal,
  getRemainingStock,
}: CartPageProps) {
  // 장바구니 총액 계산
  const totals = calculateCartTotal();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        <ProductList
          products={products}
          searchTerm={searchTerm}
          addToCart={addToCart}
          getRemainingStock={getRemainingStock}
          isAdmin={isAdmin}
        />
      </div>

      <div className="lg:col-span-1">
        <div className="sticky top-24 space-y-4">
          <Cart
            cart={cart}
            removeFromCart={removeFromCart}
            updateQuantity={updateQuantity}
            calculateItemTotal={calculateItemTotal}
          />

          {cart.length > 0 && (
            <>
              <CouponSelector
                coupons={coupons}
                selectedCoupon={selectedCoupon}
                applyCoupon={applyCoupon}
                removeCoupon={removeSelectedCoupon}
              />

              <OrderSummary totals={totals} completeOrder={completeOrder} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
