import type { CartItem, Coupon } from '../../../../types';
import { formatNumberRate, formatNumberWon } from '../../../utils/formatters';

interface Props {
  cart: CartItem[];
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  applyCoupon: (params: { cart: CartItem[]; coupon: Coupon }) => void;
  clearSelectedCoupon: () => void;
}

export function Coupons({
  cart,
  coupons,
  selectedCoupon,
  applyCoupon,
  clearSelectedCoupon,
}: Props) {
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
            if (coupon) applyCoupon({ cart, coupon });
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
