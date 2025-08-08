import { useAtomValue } from "jotai";
import { CartIcon, CloseIcon } from "./icons";

// ✅ Jotai atoms import
import { couponsAtom } from "../atoms";

// ✅ Jotai hooks import
import { useCartJotai } from "../hooks/useCart";
import { useNotificationJotai } from "../hooks/useNotification";

// ✅ 비즈니스 로직 import
import {
  getCartItemDiscountInfo,
  getEmptyCartInfo,
  formatCouponOptionText,
  getPaymentSummary,
  getPaymentButtonInfo,
  getQuantityControlInfo,
  getCartHeaderInfo,
  getCouponSectionInfo,
  getDiscountDisplayStyle,
} from "../models/cart";

// 🚀 Props 완전 제거!
export function CartPage() {
  // ✅ 전역 상태에서 직접 가져오기
  const coupons = useAtomValue(couponsAtom);

  // ✅ 전역 hooks 사용
  const notifications = useNotificationJotai();
  const cart = useCartJotai({
    addNotification: notifications.addNotification,
  });

  // ✅ cart hook에서 모든 필요한 값들 가져오기
  const {
    cart: cartItems,
    selectedCoupon,
    totals,
    updateQuantity,
    removeFromCart,
    applyCoupon,
    setSelectedCoupon,
    completeOrder,
    calculateItemTotal,
  } = cart;

  // ✅ 비즈니스 로직 계산
  const headerInfo = getCartHeaderInfo(cartItems.length);
  const emptyCartInfo = getEmptyCartInfo();
  const couponSectionInfo = getCouponSectionInfo(coupons, cartItems.length > 0);
  const paymentSummary = getPaymentSummary(
    totals.totalBeforeDiscount,
    totals.finalTotal,
    totals.couponDiscount
  );
  const paymentButtonInfo = getPaymentButtonInfo(totals.finalTotal);

  return (
    <div className="lg:col-span-1">
      <div className="sticky top-24 space-y-4">
        {/* 🛒 장바구니 목록 섹션 */}
        <section className="bg-white rounded-lg border border-gray-200 p-4">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <CartIcon className="w-5 h-5 mr-2" strokeWidth={2} />
            {headerInfo.title}
            {headerInfo.showItemCount && (
              <span className="text-sm font-normal text-gray-500 ml-1">
                {headerInfo.itemCountText}
              </span>
            )}
          </h2>

          {cartItems.length === 0 ? (
            <div className="text-center py-8">
              <CartIcon
                className={`${emptyCartInfo.iconSize} ${emptyCartInfo.iconColor} mx-auto mb-4`}
                strokeWidth={2}
              />
              <p className="text-gray-500 text-sm">{emptyCartInfo.message}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cartItems.map((item) => {
                const itemTotal = calculateItemTotal(item);
                const discountInfo = getCartItemDiscountInfo(item, itemTotal);
                const quantityControlInfo = getQuantityControlInfo(
                  item.quantity
                );
                const discountStyle = getDiscountDisplayStyle(
                  discountInfo.discountRate
                );

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
                        <CloseIcon className="w-4 h-4" strokeWidth={2} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <button
                          onClick={
                            () =>
                              updateQuantity(item.product.id, item.quantity - 1) // ✅ 직접 사용
                          }
                          disabled={quantityControlInfo.decreaseDisabled}
                          className={`w-6 h-6 rounded border border-gray-300 flex items-center justify-center ${
                            quantityControlInfo.decreaseDisabled
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "hover:bg-gray-100"
                          }`}
                        >
                          <span className="text-xs">−</span>
                        </button>
                        <span className="mx-3 text-sm font-medium w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={
                            () =>
                              updateQuantity(item.product.id, item.quantity + 1) // ✅ 직접 사용
                          }
                          disabled={quantityControlInfo.increaseDisabled}
                          className={`w-6 h-6 rounded border border-gray-300 flex items-center justify-center ${
                            quantityControlInfo.increaseDisabled
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "hover:bg-gray-100"
                          }`}
                        >
                          <span className="text-xs">+</span>
                        </button>
                      </div>

                      <div className="text-right">
                        {discountInfo.hasDiscount && (
                          <span
                            className={`text-xs ${discountStyle.textColor} ${discountStyle.fontWeight} block`}
                          >
                            -{discountInfo.discountRate}%
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

        {/* 🎫 쿠폰 섹션 */}
        {couponSectionInfo.shouldShow && (
          <section className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700">
                {couponSectionInfo.title}
              </h3>
              <button className="text-xs text-blue-600 hover:underline">
                쿠폰 등록
              </button>
            </div>

            {couponSectionInfo.hasCoupons ? (
              <select
                className="w-full text-sm border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                value={selectedCoupon?.code || ""}
                onChange={(e) => {
                  const coupon = coupons.find((c) => c.code === e.target.value);
                  if (coupon) applyCoupon(coupon); // ✅ 직접 사용
                  else setSelectedCoupon(null); // ✅ 직접 사용
                }}
              >
                <option value="">{couponSectionInfo.selectPlaceholder}</option>
                {coupons.map((coupon) => (
                  <option key={coupon.code} value={coupon.code}>
                    {formatCouponOptionText(coupon)}
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-sm text-gray-500 text-center py-2">
                {couponSectionInfo.noCouponsMessage}
              </p>
            )}
          </section>
        )}

        {/* 💳 결제 정보 섹션 */}
        {cartItems.length > 0 && (
          <section className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-4">결제 정보</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">상품 금액</span>
                <span className="font-medium">
                  {paymentSummary.formattedTotalBefore}원
                </span>
              </div>

              {/* 할인 금액 표시 */}
              {(totals.couponDiscount > 0 || paymentSummary.hasDiscount) && (
                <div className="flex justify-between text-red-500">
                  <span>할인 금액</span>
                  <span>
                    -
                    {(
                      totals.couponDiscount +
                      (totals.totalBeforeDiscount - totals.totalAfterDiscount)
                    ).toLocaleString()}
                    원
                  </span>
                </div>
              )}

              <div className="flex justify-between py-2 border-t border-gray-200">
                <span className="font-semibold">결제 예정 금액</span>
                <span className="font-bold text-lg text-gray-900">
                  {paymentSummary.formattedTotalAfter}원
                </span>
              </div>
            </div>

            <button
              onClick={completeOrder} // ✅ 직접 사용
              disabled={paymentButtonInfo.isDisabled}
              className={paymentButtonInfo.className}
            >
              {paymentButtonInfo.text}
            </button>

            <div className="mt-3 text-xs text-gray-500 text-center">
              <p>* 실제 결제는 이루어지지 않습니다</p>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
