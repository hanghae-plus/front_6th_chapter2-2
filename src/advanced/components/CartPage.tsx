import { Dispatch, SetStateAction, useCallback } from "react";
import { Coupon } from "../../types";
import { getMaxApplicableDiscount, hasBulkPurchase } from "../models/cart";
import { useCart } from "../hooks/useCart";
import { useCoupons } from "../hooks/useCoupons";
import { useProducts } from "../hooks/useProducts";
import { ProductList } from "./ui/CartPage/ProductList";
import { Cart } from "./ui/CartPage/Cart";
import { CouponInfo } from "./ui/CartPage/CouponInfo";
import { PurchaseInfo } from "./ui/CartPage/PurchaseInfo";
import { selectedCouponAtom, totalItemCountAtom } from "../atoms";
import { useAtom } from "jotai";

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
// - Cart: 장바구니 표시 및 결제

interface CartPageProps {
  addNotification: (
    message: string,
    type: "error" | "success" | "warning"
  ) => void;
  debouncedSearchTerm: string;
}

export function CartPage({
  addNotification,
  debouncedSearchTerm,
}: CartPageProps) {
  const [selectedCoupon, setSelectedCoupon] = useAtom(selectedCouponAtom);
  const [totalItemCount, setTotalItemCount] = useAtom(totalItemCountAtom);

  const { products } = useProducts({
    addNotification,
  });

  const {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    calculateCartTotal,
    clearCart,
  } = useCart({
    products,
    addNotification,
    selectedCoupon,
    setSelectedCoupon,
    setTotalItemCount,
  });

  const { coupons } = useCoupons({
    addNotification,
    selectedCoupon,
    setSelectedCoupon,
  });

  const completeOrder = useCallback(() => {
    const orderNumber = `ORD-${Date.now()}`;
    addNotification(
      `주문이 완료되었습니다. 주문번호: ${orderNumber}`,
      "success"
    );
    clearCart();
    setSelectedCoupon(null);
  }, [addNotification]);

  const discount = getMaxApplicableDiscount({
    discounts: cart.flatMap((item) => item.product.discounts),
    quantity: cart.reduce((acc, item) => acc + item.quantity, 0),
    hasBulkPurchase: hasBulkPurchase(cart),
  });

  const totals = calculateCartTotal({
    cart,
    selectedCoupon,
  });

  const filteredProducts = debouncedSearchTerm
    ? products.filter(
        (product) =>
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
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        {/* 상품 목록 */}
        <ProductList
          products={products}
          filteredProducts={filteredProducts}
          debouncedSearchTerm={debouncedSearchTerm}
          cart={cart}
          addToCart={addToCart}
        />
      </div>

      <div className="lg:col-span-1">
        <div className="sticky top-24 space-y-4">
          <Cart
            cart={cart}
            discount={discount}
            removeFromCart={removeFromCart}
            updateQuantity={updateQuantity}
            products={products}
          />

          {cart.length > 0 && (
            <>
              <CouponInfo
                selectedCoupon={selectedCoupon}
                setSelectedCoupon={setSelectedCoupon}
                coupons={coupons}
                applyCoupon={applyCoupon}
                cart={cart}
              />

              <PurchaseInfo totals={totals} completeOrder={completeOrder} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
