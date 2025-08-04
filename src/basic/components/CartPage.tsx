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

import { useState, useMemo } from "react";
import { useProducts } from "../hooks/useProducts";
import { useCart } from "../hooks/useCart";
import { useCoupons } from "../hooks/useCoupons";
import { SearchBar } from "./SearchBar";
import { ProductList } from "./ProductList";
import { Cart } from "./Cart";
import { useDebounce } from "../utils/hooks/useDebounce";

export function CartPage() {
  const { products } = useProducts();
  const {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    selectedCoupon,
    applyCoupon,
    clearCart,
  } = useCart();
  const { coupons } = useCoupons();

  const completeOrder = () => {
    if (cart.length === 0) {
      alert("장바구니에 담긴 상품이 없습니다.");
      return;
    }
    alert("주문이 완료되었습니다!");
    clearCart();
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* 상품 목록 및 검색 */}
      <div className="lg:col-span-2 flex-1">
        <h1 className="text-3xl font-bold mb-6">상품 목록</h1>
        <ProductList products={filteredProducts} onAddToCart={addToCart} />
      </div>

      {/* 장바구니 및 결제 */}
      <div className="lg:col-span-1 lg:w-96">
        <Cart
          cart={cart}
          coupons={coupons}
          selectedCoupon={selectedCoupon}
          removeFromCart={removeFromCart}
          updateQuantity={updateQuantity}
          applyCoupon={applyCoupon}
          onCompleteOrder={completeOrder}
        />
      </div>
    </div>
  );
}
