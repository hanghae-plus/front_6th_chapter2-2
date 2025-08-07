import { Dispatch, SetStateAction, useCallback } from "react";
import { Coupon } from "../../types";
import { formatPrice } from "../utils/formatters";
import {
  getMaxApplicableDiscount,
  hasBulkPurchase,
  calculateItemTotal,
} from "../models/cart";
import { ProductListSummary } from "./ui/ProductListSummary";
import { CloseIcon, ImageIcon, ShoppingBagIcon } from "./icons";
import { Search } from "./ui/Search";
import { useCart } from "../hooks/useCart";
import { useCoupons } from "../hooks/useCoupons";
import { useProducts } from "../hooks/useProducts";

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
  selectedCoupon: Coupon | null;
  setSelectedCoupon: Dispatch<SetStateAction<Coupon | null>>;
  debouncedSearchTerm: string;
  setTotalItemCount: Dispatch<SetStateAction<number>>;
}

export function CartPage({
  addNotification,
  selectedCoupon,
  setSelectedCoupon,
  debouncedSearchTerm,
  setTotalItemCount,
}: CartPageProps) {
  // TODO: 구현

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
    getRemainingStock,
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
        <section>
          <ProductListSummary products={products} />
          {filteredProducts.length === 0 ? (
            <Search.NoResults debouncedSearchTerm={debouncedSearchTerm} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((product) => {
                const remainingStock = getRemainingStock({
                  product,
                  cart,
                });

                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    {/* 상품 이미지 영역 (placeholder) */}
                    <div className="relative">
                      <div className="aspect-square bg-gray-100 flex items-center justify-center">
                        <ImageIcon />
                      </div>
                      {product.isRecommended && (
                        <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                          BEST
                        </span>
                      )}
                      {product.discounts.length > 0 && (
                        <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                          ~
                          {Math.max(...product.discounts.map((d) => d.rate)) *
                            100}
                          %
                        </span>
                      )}
                    </div>

                    {/* 상품 정보 */}
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 mb-1">
                        {product.name}
                      </h3>
                      {product.description && (
                        <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                          {product.description}
                        </p>
                      )}

                      {/* 가격 정보 */}
                      <div className="mb-3">
                        <p className="text-lg font-bold text-gray-900">
                          {formatPrice({
                            price: product.price,
                            productId: product.id,
                            products,
                            isAdmin: false,
                            cart,
                          })}
                        </p>
                        {product.discounts.length > 0 && (
                          <p className="text-xs text-gray-500">
                            {product.discounts[0].quantity}개 이상 구매시 할인{" "}
                            {product.discounts[0].rate * 100}%
                          </p>
                        )}
                      </div>

                      {/* 재고 상태 */}
                      <div className="mb-3">
                        {remainingStock <= 5 && remainingStock > 0 && (
                          <p className="text-xs text-red-600 font-medium">
                            품절임박! {remainingStock}개 남음
                          </p>
                        )}
                        {remainingStock > 5 && (
                          <p className="text-xs text-gray-500">
                            재고 {remainingStock}개
                          </p>
                        )}
                      </div>

                      {/* 장바구니 버튼 */}
                      <button
                        onClick={() => addToCart({ product, cart })}
                        disabled={remainingStock <= 0}
                        className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
                          remainingStock <= 0
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-gray-900 text-white hover:bg-gray-800"
                        }`}
                      >
                        {remainingStock <= 0 ? "품절" : "장바구니 담기"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      <div className="lg:col-span-1">
        <div className="sticky top-24 space-y-4">
          <section className="bg-white rounded-lg border border-gray-200 p-4">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <ShoppingBagIcon />
              장바구니
            </h2>
            {cart.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingBagIcon
                  className="w-16 h-16 text-gray-300 mx-auto mb-4"
                  strokeWidth={1}
                />
                <p className="text-gray-500 text-sm">장바구니가 비어있습니다</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => {
                  const itemTotal = calculateItemTotal({
                    item,
                    discount,
                  });
                  const originalPrice = item.product.price * item.quantity;
                  const hasDiscount = itemTotal < originalPrice;
                  const discountRate = hasDiscount
                    ? Math.round((1 - itemTotal / originalPrice) * 100)
                    : 0;

                  return (
                    <div
                      key={item.product.id}
                      className="border-b pb-3 last:border-b-0"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-sm font-medium text-gray-900 flex-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() =>
                            removeFromCart({ productId: item.product.id, cart })
                          }
                          className="text-gray-400 hover:text-red-500 ml-2"
                        >
                          <CloseIcon />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <button
                            onClick={() =>
                              updateQuantity({
                                productId: item.product.id,
                                newQuantity: item.quantity - 1,
                                cart,
                                products,
                              })
                            }
                            className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                          >
                            <span className="text-xs">−</span>
                          </button>
                          <span className="mx-3 text-sm font-medium w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity({
                                productId: item.product.id,
                                newQuantity: item.quantity + 1,
                                cart,
                                products,
                              })
                            }
                            className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                          >
                            <span className="text-xs">+</span>
                          </button>
                        </div>
                        <div className="text-right">
                          {hasDiscount && (
                            <span className="text-xs text-red-500 font-medium block">
                              -{discountRate}%
                            </span>
                          )}
                          <p className="text-sm font-medium text-gray-900">
                            {Math.round(itemTotal).toLocaleString()}원
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {cart.length > 0 && (
            <>
              <section className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-700">
                    쿠폰 할인
                  </h3>
                  <button className="text-xs text-blue-600 hover:underline">
                    쿠폰 등록
                  </button>
                </div>
                <select
                  className="w-full text-sm border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                  value={selectedCoupon?.code || ""}
                  onChange={(e) => {
                    const coupon = coupons.find(
                      (c) => c.code === e.target.value
                    );
                    if (coupon) applyCoupon({ coupon, cart });
                    else setSelectedCoupon(null);
                  }}
                >
                  <option value="">쿠폰 선택</option>
                  {coupons.map((coupon) => (
                    <option key={coupon.code} value={coupon.code}>
                      {coupon.name} (
                      {coupon.discountType === "amount"
                        ? `${coupon.discountValue.toLocaleString()}원`
                        : `${coupon.discountValue}%`}
                      )
                    </option>
                  ))}
                </select>
              </section>

              <section className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="text-lg font-semibold mb-4">결제 정보</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">상품 금액</span>
                    <span className="font-medium">
                      {totals.totalBeforeDiscount.toLocaleString()}원
                    </span>
                  </div>
                  {totals.totalBeforeDiscount - totals.totalAfterDiscount >
                    0 && (
                    <div className="flex justify-between text-red-500">
                      <span>할인 금액</span>
                      <span>
                        -
                        {(
                          totals.totalBeforeDiscount - totals.totalAfterDiscount
                        ).toLocaleString()}
                        원
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between py-2 border-t border-gray-200">
                    <span className="font-semibold">결제 예정 금액</span>
                    <span className="font-bold text-lg text-gray-900">
                      {totals.totalAfterDiscount.toLocaleString()}원
                    </span>
                  </div>
                </div>

                <button
                  onClick={completeOrder}
                  className="w-full mt-4 py-3 bg-yellow-400 text-gray-900 rounded-md font-medium hover:bg-yellow-500 transition-colors"
                >
                  {totals.totalAfterDiscount.toLocaleString()}원 결제하기
                </button>

                <div className="mt-3 text-xs text-gray-500 text-center">
                  <p>* 실제 결제는 이루어지지 않습니다</p>
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
