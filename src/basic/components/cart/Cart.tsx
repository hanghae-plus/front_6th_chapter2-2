import { CartItem as CartItemType, Coupon } from "../../../types";
import { CartTotal } from "../../models/cart";
import { BasketIcon } from "../icons";
import Button from "../ui/Button";
import { CartItem } from "./CartItem";

interface CartProps {
  cart: CartItemType[];
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  totals: CartTotal;
  calculateItemTotal: (item: CartItemType, cart: CartItemType[]) => number;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  setSelectedCoupon: (coupon: Coupon | null) => void;
  applyCoupon: (coupon: Coupon) => void;
  completeOrder: () => void;
}

export const Cart = ({
  cart,
  coupons,
  selectedCoupon,
  totals,
  calculateItemTotal,
  removeFromCart,
  updateQuantity,
  setSelectedCoupon,
  applyCoupon,
  completeOrder,
}: CartProps) => {
  return (
    <div className="sticky top-24 space-y-4">
      {/* 장바구니 목록 */}
      <section className="bg-white rounded-lg border border-gray-200 p-4">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <BasketIcon className="w-5 h-5 mr-2" />
          장바구니
        </h2>

        {cart.length === 0 ? (
          <div className="text-center py-8">
            <BasketIcon
              strokeWidth={1}
              className="w-16 h-16 text-gray-300 mx-auto mb-4"
            />
            <p className="text-gray-500 text-sm">장바구니가 비어있습니다</p>
          </div>
        ) : (
          <div className="space-y-3">
            {cart.map((item) => (
              <CartItem
                key={item.product.id}
                item={item}
                itemTotal={calculateItemTotal(item, cart)}
                removeFromCart={removeFromCart}
                updateQuantity={updateQuantity}
              />
            ))}
          </div>
        )}
      </section>

      {cart.length > 0 && (
        <>
          {/* 쿠폰 선택 */}
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

          {/* 결제 정보 */}
          <section className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-4">결제 정보</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">상품 금액</span>
                <span className="font-medium">
                  {totals.totalBeforeDiscount.toLocaleString()}원
                </span>
              </div>
              {totals.totalBeforeDiscount - totals.totalAfterDiscount > 0 && (
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

            <Button
              onClick={completeOrder}
              variant="payment"
              sizes="lg"
              fullWidth
              className="mt-4 py-3"
            >
              {totals.totalAfterDiscount.toLocaleString()}원 결제하기
            </Button>

            <div className="mt-3 text-xs text-gray-500 text-center">
              <p>* 실제 결제는 이루어지지 않습니다</p>
            </div>
          </section>
        </>
      )}
    </div>
  );
};
