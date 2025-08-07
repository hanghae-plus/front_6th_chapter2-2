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

import { Cart } from './cart/Cart.tsx';
import { ProductList } from './cart/ProductList.tsx';
import { CartItem, Coupon } from '../../types.ts';
import { ProductWithUI } from '../constants';
import React from 'react';
import { getRemainingStock } from '../models/cart.ts';

type CartPageProps = {
  // ProductListPros
  filteredProducts: ProductWithUI[];
  formatPrice: (price: number, productId?: string) => string;
  // CartProps
  cart: CartItem[];
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  applyCoupon: (coupon: Coupon) => void;
  addItemToCart: (product: ProductWithUI) => void;
  removeItemFromCart: (productId: string) => void;
  updateCartItemQuantity: (productId: string, newQuantity: number) => void;
  setSelectedCoupon: React.Dispatch<React.SetStateAction<Coupon | null>>;
  calculateItemTotal: (item: CartItem) => number;
  totals: {
    totalBeforeDiscount: number;
    totalAfterDiscount: number;
  };
  completeOrder: () => void;
  //searchBar
  debouncedSearchTerm: string;
  products: ProductWithUI[];
  addNotification: (message: string, type?: 'error' | 'success' | 'warning') => void;
};

export function CartPage({
  filteredProducts,
  formatPrice,
  cart,
  selectedCoupon,
  setSelectedCoupon,
  applyCoupon,
  addItemToCart,
  removeItemFromCart,
  updateCartItemQuantity,
  calculateItemTotal,
  coupons,
  totals,
  completeOrder,
  debouncedSearchTerm,
  products,
  addNotification,
}: CartPageProps) {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          {/* 상품 목록 */}
          <section>
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-800">전체 상품</h2>
              <div className="text-sm text-gray-600">총 {products.length}개 상품</div>
            </div>
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">"{debouncedSearchTerm}"에 대한 검색 결과가 없습니다.</p>
              </div>
            ) : (
              <ProductList
                cart={cart}
                filteredProducts={filteredProducts}
                formatPrice={formatPrice}
                addNotification={addNotification}
                addItemToCart={addItemToCart}
                getRemainingStock={getRemainingStock}
              />
            )}
          </section>
        </div>
        <Cart
          cart={cart}
          coupons={coupons}
          selectedCoupon={selectedCoupon}
          applyCoupon={applyCoupon}
          removeItemFromCart={removeItemFromCart}
          updateCartItemQuantity={updateCartItemQuantity}
          setSelectedCoupon={setSelectedCoupon}
          calculateItemTotal={calculateItemTotal}
          totals={totals}
          completeOrder={completeOrder}
          addNotification={addNotification}
          debouncedSearchTerm={debouncedSearchTerm}
          products={products}
        />
      </div>
    </>
  );
}
