import type { CartItem, Coupon } from "../../../types";
import { calculateCartTotal } from "../../entities/CartItem";
import type { ProductWithUI } from "../../entities/ProductWithUI";
import { CartItemView } from "./CartItemView";
import { CouponOptionView } from "./CouponOptionView";
import { SectionPaymentInfo } from "./SectionPaymentInfo";
import { IconEmptyCart } from "./IconEmptyCart";
import { IconCart } from "./IconCart";

export function SectionCart({
  cart,
  products,
  setCart,
  handleNotificationAdd,
  coupons,
  selectedCoupon,
  setSelectedCoupon,
}: {
  cart: CartItem[];
  products: ProductWithUI[];
  setCart: (cart: CartItem[]) => void;
  handleNotificationAdd: (
    message: string,
    type: "error" | "success" | "warning"
  ) => void;
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  setSelectedCoupon: (coupon: Coupon | null) => void;
}) {
  const totals = calculateCartTotal(cart, selectedCoupon);

  function handleOrderComplete() {
    const orderNumber = `ORD-${Date.now()}`;
    handleNotificationAdd(
      `주문이 완료되었습니다. 주문번호: ${orderNumber}`,
      "success"
    );
    setCart([]);
    setSelectedCoupon(null);
  }

  function handleCouponApply(coupon: Coupon) {
    const currentTotal = calculateCartTotal(
      cart,
      selectedCoupon
    ).totalAfterDiscount;

    if (currentTotal < 10000 && coupon.discountType === "percentage") {
      handleNotificationAdd(
        "percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.",
        "error"
      );
      return;
    }

    setSelectedCoupon(coupon);
    handleNotificationAdd("쿠폰이 적용되었습니다.", "success");
  }

  function handleCouponSelect(e: React.ChangeEvent<HTMLSelectElement>) {
    const coupon = coupons.find((c) => c.code === e.target.value);
    if (coupon) handleCouponApply(coupon);
    else setSelectedCoupon(null);
  }

  return (
    <div className="lg:col-span-1">
      <div className="sticky top-24 space-y-4">
        <section className="bg-white rounded-lg border border-gray-200 p-4">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <IconCart />
            장바구니
          </h2>
          {cart.length === 0 ? (
            <div className="text-center py-8">
              <IconEmptyCart />
              <p className="text-gray-500 text-sm">장바구니가 비어있습니다</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((cartItem) => (
                <CartItemView
                  key={cartItem.product.id}
                  item={cartItem}
                  cart={cart}
                  products={products}
                  setCart={setCart}
                  handleNotificationAdd={handleNotificationAdd}
                />
              ))}
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
                  onChange={handleCouponSelect}
                >
                  <option value="">쿠폰 선택</option>
                  {coupons.map((coupon) => (
                    <CouponOptionView key={coupon.code} coupon={coupon} />
                  ))}
                </select>
              )}
            </section>

            <SectionPaymentInfo
              totals={totals}
              handleOrderComplete={handleOrderComplete}
            />
          </>
        )}
      </div>
    </div>
  );
}
