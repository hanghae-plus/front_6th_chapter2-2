import { useCallback } from "react";
import { CartItem, Coupon, Product } from "../../types";
import { generateOrderNumber } from "../models/coupon";
import { canApplyCoupon } from "../models/discount";
import { filterProducts, ProductWithUI } from "../models/product";
import {
  getRemainingStock,
  addToCart as _addToCart,
  removeFromCart as _removeFromCart,
  updateQuantity as _updateQuantity,
  calculateCartTotal,
  calculateItemTotal,
} from "../models/cart";

import ShopProduct from "../components/ShopProduct";
import PaymentInfo from "../components/PaymentInfo";

interface Props {
  searchTerm: string;
  products: Product[];
  cart: CartItem[];
  coupons: Coupon[];
  selectedCoupon: Coupon | null;

  // NOTE: 임시props
  formatPrice: (price: number, productId?: string) => string;
  addNotification: (
    message: string,
    type: "error" | "success" | "warning"
  ) => void;
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  setSelectedCoupon: React.Dispatch<React.SetStateAction<Coupon | null>>;
}

const ShopPage = ({
  searchTerm,
  cart,
  products,
  coupons,
  selectedCoupon,
  addNotification,
  formatPrice,
  setCart,
  setSelectedCoupon,
}: Props) => {
  const addToCart = useCallback(
    (product: ProductWithUI) => {
      const result = _addToCart(cart, product);

      if (!result.success) {
        addNotification(result.reason, "error");

        return;
      }

      setCart(result.cart);

      addNotification("장바구니에 담았습니다", "success");
    },
    [cart, addNotification]
  );

  const removeFromCart = useCallback((productId: string) => {
    setCart((prevCart) => _removeFromCart(prevCart, productId));
  }, []);

  const updateQuantity = useCallback(
    (product: Product, newQuantity: number) => {
      const result = _updateQuantity(cart, product, newQuantity);

      if (!result.success) {
        return addNotification(result.reason, "error");
      }

      setCart(result.cart);
    },
    [addNotification, cart]
  );

  const applyCoupon = useCallback(
    (coupon: Coupon) => {
      const currentTotal = calculateCartTotal(
        cart,
        selectedCoupon
      ).totalAfterDiscount;

      const validation = canApplyCoupon(coupon, currentTotal);
      if (!validation.canApply) {
        addNotification(validation.reason!, "error");
        return;
      }

      setSelectedCoupon(coupon);
      addNotification("쿠폰이 적용되었습니다.", "success");
    },
    [addNotification, cart, selectedCoupon]
  );

  const completeOrder = useCallback(() => {
    const orderNumber = generateOrderNumber();
    addNotification(
      `주문이 완료되었습니다. 주문번호: ${orderNumber}`,
      "success"
    );
    setCart([]);
    setSelectedCoupon(null);
  }, [addNotification]);

  const filteredProducts = filterProducts(products, searchTerm);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        {/* 상품 목록 */}
        <section>
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-800">전체 상품</h2>
            <div className="text-sm text-gray-600">
              총 {products.length}개 상품
            </div>
          </div>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">
                "{searchTerm}"에 대한 검색 결과가 없습니다.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((product) => {
                const remainingStock = getRemainingStock(cart, product);

                return (
                  <ShopProduct
                    key={product.id}
                    product={product}
                    remainingStock={remainingStock}
                    onAddToCart={() => addToCart(product)}
                    formatPrice={formatPrice}
                  />
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
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              장바구니
            </h2>
            {cart.length === 0 ? (
              <div className="text-center py-8">
                <svg
                  className="w-16 h-16 text-gray-300 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                <p className="text-gray-500 text-sm">장바구니가 비어있습니다</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => {
                  const itemTotal = calculateItemTotal(item);
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
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-gray-400 hover:text-red-500 ml-2"
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
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <button
                            onClick={() =>
                              updateQuantity(item.product, item.quantity - 1)
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
                              updateQuantity(item.product, item.quantity + 1)
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
                {coupons.length > 0 && (
                  <select
                    className="w-full text-sm border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                    value={selectedCoupon?.code || ""}
                    onChange={(e) => {
                      const coupon = coupons.find(
                        (c) => c.code === e.target.value
                      );
                      if (coupon) applyCoupon(coupon);
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
                )}
              </section>

              <PaymentInfo
                cart={cart}
                selectedCoupon={selectedCoupon}
                onPay={completeOrder}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
