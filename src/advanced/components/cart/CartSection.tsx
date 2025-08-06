import { CartItem } from "./CartItem";
import { calculateCartTotal } from "../../service/cartService";
import { useCartContext } from "../../contexts/CartContext";
import { useCouponContext } from "../../contexts/CouponContext";
import { useCouponSelectionContext } from "../../contexts/CouponSelectionContext";

export const CartSection = () => {
  const { cart, removeFromCart, updateQuantity } = useCartContext();
  const { coupons, applyCoupon, completeOrder } = useCouponContext();
  const { selectedCoupon } = useCouponSelectionContext();

  const totals = calculateCartTotal(cart, selectedCoupon);

  return (
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
            {cart.map((item) => (
              <CartItem
                key={item.product.id}
                item={item}
                cart={cart}
                onRemove={removeFromCart}
                onUpdateQuantity={updateQuantity}
              />
            ))}
          </div>
        )}
      </section>

      {cart.length > 0 && (
        <>
          <section className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700">쿠폰 할인</h3>
              <button className="text-xs text-blue-600 hover:underline">
                쿠폰 등록
              </button>
            </div>
            {coupons.length > 0 && (
              <select
                className="w-full text-sm border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                value={selectedCoupon?.code || ""}
                onChange={(e) => {
                  const coupon = coupons.find((c) => c.code === e.target.value);
                  if (coupon) applyCoupon(coupon);
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

          <section className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              결제 정보
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>상품 금액</span>
                <span>{totals.totalBeforeDiscount.toLocaleString()}원</span>
              </div>
              {selectedCoupon && (
                <div className="flex justify-between text-green-600">
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
              <div className="border-t pt-2 flex justify-between font-semibold">
                <span>총 결제 금액</span>
                <span>{totals.totalAfterDiscount.toLocaleString()}원</span>
              </div>
            </div>
            <button
              onClick={completeOrder}
              className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
            >
              {totals.totalAfterDiscount.toLocaleString()}원 결제하기
            </button>
          </section>
        </>
      )}
    </div>
  );
};
