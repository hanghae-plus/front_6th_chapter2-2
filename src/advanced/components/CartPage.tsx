import { useCart } from "../hooks/useCart";
import { ProductList } from "./ui/CartPage/ProductList";
import { Cart } from "./ui/CartPage/Cart";
import { CouponInfo } from "./ui/CartPage/CouponInfo";
import { PurchaseInfo } from "./ui/CartPage/PurchaseInfo";

// 장바구니 페이지 컴포넌트
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
// - Cart: 장바구니 표시 및 결제

export function CartPage() {
  const { cart } = useCart();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        <ProductList />
      </div>

      <div className="lg:col-span-1">
        <div className="sticky top-24 space-y-4">
          <Cart />
          {cart.length > 0 && (
            <>
              <CouponInfo />
              <PurchaseInfo />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
