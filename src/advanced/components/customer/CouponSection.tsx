import { useAtom } from "jotai";
import { couponsAtom, selectedCouponAtom } from "../../atoms/couponAtoms";
import { useCoupon } from "../../hooks/useCoupon";
import { useCartTotals } from "../../hooks/useCartTotals";
import { useCart } from "../../hooks/useCart";
import { useProduct } from "../../hooks/useProduct";

export const CouponSection = () => {
  /** 쿠폰 목록 - Jotai 사용 */
  const [coupons] = useAtom(couponsAtom);

  /** 선택된 쿠폰 - Jotai 사용 */
  const [selectedCoupon, setSelectedCoupon] = useAtom(selectedCouponAtom);

  /** 상품 데이터 - useProduct hook 사용 */
  const { products } = useProduct();

  /** 장바구니 관련 actions - useCart hook 사용 */
  const { calculateItemTotal } = useCart({ products });

  /** 장바구니 총액 계산 - 직접 hook 사용 */
  const totals = useCartTotals({ calculateItemTotal });

  /** 쿠폰 관련 actions - useCoupon hook 사용 */
  const { applyCoupon } = useCoupon({ cartTotals: totals });

  /** 쿠폰 선택 */
  const handleCouponSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const coupon = coupons.find((c) => c.code === e.target.value);

    if (coupon) {
      // 쿠폰 적용
      applyCoupon(coupon);
    } else {
      // 쿠폰 해제
      setSelectedCoupon(null);
    }
  };

  return (
    <section className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">쿠폰 할인</h3>
        <button className="text-xs text-blue-600 hover:underline">쿠폰 등록</button>
      </div>

      {coupons.length > 0 && (
        <select className="w-full text-sm border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500" value={selectedCoupon?.code || ""} onChange={handleCouponSelect}>
          <option value="">쿠폰 선택</option>
          {coupons.map((coupon) => (
            <option key={coupon.code} value={coupon.code}>
              {coupon.name} ({coupon.discountType === "amount" ? `${coupon.discountValue.toLocaleString()}원` : `${coupon.discountValue}%`})
            </option>
          ))}
        </select>
      )}
    </section>
  );
};
