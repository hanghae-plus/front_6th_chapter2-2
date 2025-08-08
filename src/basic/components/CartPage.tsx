import { CartItem, Coupon } from "../../types";
import { CartIcon, CloseIcon } from "./icons";

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

interface CartPageProps {
  // 데이터 props
  cart: CartItem[];
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  totals: {
    totalBeforeDiscount: number;
    totalAfterDiscount: number;
    couponDiscount: number; // ✅ 이걸 추가해야 함
    finalTotal: number;
  };

  // 이벤트 핸들러 props
  onUpdateQuantity: (productId: string, newQuantity: number) => void;
  onRemoveFromCart: (productId: string) => void;
  onApplyCoupon: (coupon: Coupon) => void;
  onSetSelectedCoupon: (coupon: Coupon | null) => void;
  onCompleteOrder: () => void;
  calculateItemTotal: (item: CartItem) => number;
}

export function CartPage({
  cart,
  coupons,
  selectedCoupon,
  totals,
  onUpdateQuantity,
  onRemoveFromCart,
  onApplyCoupon,
  onSetSelectedCoupon,
  onCompleteOrder,
  calculateItemTotal,
}: CartPageProps) {
  const headerInfo = getCartHeaderInfo(cart.length);
  const emptyCartInfo = getEmptyCartInfo();
  const couponSectionInfo = getCouponSectionInfo(coupons, cart.length > 0);
  const paymentSummary = getPaymentSummary(
    totals.totalBeforeDiscount,
    totals.finalTotal, // ✅ totalAfterDiscount 대신 finalTotal 사용
    totals.couponDiscount // ✅ couponDiscount 추가
  );
  const paymentButtonInfo = getPaymentButtonInfo(totals.finalTotal);

  return (
    <div className="lg:col-span-1">
      <div className="sticky top-24 space-y-4">
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

          {cart.length === 0 ? (
            <div className="text-center py-8">
              <CartIcon
                className={`${emptyCartInfo.iconSize} ${emptyCartInfo.iconColor} mx-auto mb-4`}
                strokeWidth={2}
              />
              <p className="text-gray-500 text-sm">{emptyCartInfo.message}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((item) => {
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
                        onClick={() => onRemoveFromCart(item.product.id)}
                        className="text-gray-400 hover:text-red-500 ml-2"
                      >
                        <CloseIcon className="w-4 h-4" strokeWidth={2} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <button
                          onClick={() =>
                            onUpdateQuantity(item.product.id, item.quantity - 1)
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
                          onClick={() =>
                            onUpdateQuantity(item.product.id, item.quantity + 1)
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
                  if (coupon) onApplyCoupon(coupon);
                  else onSetSelectedCoupon(null);
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

        {cart.length > 0 && (
          <section className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-4">결제 정보</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">상품 금액</span>
                <span className="font-medium">
                  {paymentSummary.formattedTotalBefore}원
                </span>
              </div>

              {/* ✅ 상품 할인 + 쿠폰 할인 모두 포함 */}
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
              onClick={onCompleteOrder}
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
