import {
  useApplyCoupon,
  useClearSelectedCoupon,
  useCoupons,
  useSelectedCoupon,
} from '../../../hooks/useCoupons';
import { formatNumberRate, formatNumberWon } from '../../../utils/formatters';

export function Coupons() {
  const coupons = useCoupons();
  const selectedCoupon = useSelectedCoupon();
  const applyCoupon = useApplyCoupon();
  const clearSelectedCoupon = useClearSelectedCoupon();

  return (
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
          value={selectedCoupon?.code || ''}
          onChange={(e) => {
            const coupon = coupons.find((c) => c.code === e.target.value);
            if (coupon) applyCoupon({ coupon });
            else clearSelectedCoupon();
          }}
        >
          <option value="">쿠폰 선택</option>
          {coupons.map((coupon) => (
            <option key={coupon.code} value={coupon.code}>
              {coupon.name} (
              {coupon.discountType === 'amount'
                ? formatNumberWon({ number: coupon.discountValue })
                : formatNumberRate({ number: coupon.discountValue })}
              )
            </option>
          ))}
        </select>
      )}
    </section>
  );
}
