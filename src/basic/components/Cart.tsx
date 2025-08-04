import { FC, useMemo } from "react";
import { CartItem, Coupon } from "../../types";
import { calculateCartTotal } from "../models/coupon";
import { Icons } from "./icons";
import { calculateItemTotal } from "../models/cart";
import { formatPercentage, formatPrice } from "../utils/formatters";

// props 타입 정의
interface CartProps {
  cart: CartItem[];
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  applyCoupon: (coupon: Coupon | null) => void;
  onCompleteOrder: () => void;
}

export const Cart: FC<CartProps> = ({
  cart,
  coupons,
  selectedCoupon,
  removeFromCart,
  updateQuantity,
  applyCoupon,
  onCompleteOrder,
}) => {
  const totals = useMemo(
    () => calculateCartTotal(cart, selectedCoupon || undefined),
    [cart, selectedCoupon]
  );

  return (
    <div className="sticky top-24 space-y-4">
      <section className="bg-white rounded-lg border border-gray-200 p-4">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <Icons.Cart />
          <span className="ml-2">장바구니</span>
        </h2>
        {cart.length === 0 ? (
          <div className="text-center py-8">
            <Icons.Cart
              width={64}
              height={64}
              className="text-gray-300 mx-auto mb-4"
            />
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
                      <Icons.Trash width={16} height={16} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity - 1)
                        }
                        className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                      >
                        <Icons.Minus width={12} height={12} />
                      </button>
                      <span className="mx-3 text-sm font-medium w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity + 1)
                        }
                        className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                      >
                        <Icons.Plus width={12} height={12} />
                      </button>
                    </div>
                    <div className="text-right">
                      {hasDiscount && (
                        <span className="text-xs text-red-500 font-medium block">
                          -{discountRate}%
                        </span>
                      )}
                      <p className="text-sm font-medium text-gray-900">
                        {formatPrice(itemTotal)}
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
                  else applyCoupon(null);
                }}
              >
                <option value="">쿠폰 선택</option>
                {coupons.map((coupon) => (
                  <option key={coupon.code} value={coupon.code}>
                    {coupon.name} (
                    {coupon.discountType === "amount"
                      ? formatPrice(coupon.discountValue)
                      : formatPercentage(coupon.discountValue / 100)}
                    )
                  </option>
                ))}
              </select>
            )}
          </section>

          <section className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-4">결제 정보</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">상품 금액</span>
                <span className="font-medium">
                  {formatPrice(totals.totalBeforeDiscount)}
                </span>
              </div>
              {totals.discount > 0 && (
                <div className="flex justify-between text-red-500">
                  <span>할인 금액</span>
                  <span>-{formatPrice(totals.discount)}</span>
                </div>
              )}
              <div className="flex justify-between py-2 border-t border-gray-200">
                <span className="font-semibold">결제 예정 금액</span>
                <span className="font-bold text-lg text-gray-900">
                  {formatPrice(totals.totalAfterDiscount)}
                </span>
              </div>
            </div>

            <button
              onClick={onCompleteOrder}
              className="w-full mt-4 py-3 bg-yellow-400 text-gray-900 rounded-md font-medium hover:bg-yellow-500 transition-colors"
            >
              {formatPrice(totals.totalAfterDiscount)} 결제하기
            </button>

            <div className="mt-3 text-xs text-gray-500 text-center">
              <p>* 실제 결제는 이루어지지 않습니다</p>
            </div>
          </section>
        </>
      )}
    </div>
  );
};
