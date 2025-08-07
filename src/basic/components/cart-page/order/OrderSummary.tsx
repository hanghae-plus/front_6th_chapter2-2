import type { CartItem, Coupon } from '../../../../types';
import * as cartModel from '../../../models/cart';
import * as couponModel from '../../../models/coupon';
import { formatNumberWon } from '../../../utils/formatters';

interface Props {
  cart: CartItem[];
  selectedCoupon: Coupon | null;
  completeOrder: () => void;
}

export function OrderSummary({ cart, selectedCoupon, completeOrder }: Props) {
  const totals = cartModel.calculateCartTotal({
    cart,
    applyCoupon: couponModel.getCouponApplier({ coupon: selectedCoupon }),
  });

  return (
    <section className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-lg font-semibold mb-4">결제 정보</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">상품 금액</span>
          <span className="font-medium">
            {formatNumberWon({ number: totals.totalBeforeDiscount })}
          </span>
        </div>

        {totals.totalBeforeDiscount - totals.totalAfterDiscount > 0 && (
          <div className="flex justify-between text-red-500">
            <span>할인 금액</span>
            <span>
              -
              {formatNumberWon({
                number: totals.totalBeforeDiscount - totals.totalAfterDiscount,
              })}
            </span>
          </div>
        )}
        <div className="flex justify-between py-2 border-t border-gray-200">
          <span className="font-semibold">결제 예정 금액</span>
          <span className="font-bold text-lg text-gray-900">
            {formatNumberWon({ number: totals.totalAfterDiscount })}
          </span>
        </div>
      </div>

      <button
        onClick={completeOrder}
        className="w-full mt-4 py-3 bg-yellow-400 text-gray-900 rounded-md font-medium hover:bg-yellow-500 transition-colors"
      >
        {formatNumberWon({ number: totals.totalAfterDiscount })} 결제하기
      </button>

      <div className="mt-3 text-xs text-gray-500 text-center">
        <p>* 실제 결제는 이루어지지 않습니다</p>
      </div>
    </section>
  );
}
