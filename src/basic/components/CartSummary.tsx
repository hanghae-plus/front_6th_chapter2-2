// src/basic/components/CartSummary.tsx
import { formatCurrency } from '../utils/formatters';

interface Props {
  cartTotal: {
    totalBeforeDiscount: number;
    totalDiscount: number;
    couponDiscount: number;
    finalTotal: number;
  };
  onCheckout: () => void;
}

export const CartSummary = ({ cartTotal, onCheckout }: Props) => {
  return (
    <section className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-lg font-semibold mb-4">결제 정보</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">상품 금액</span>
          <span className="font-medium">{formatCurrency(cartTotal.totalBeforeDiscount)}</span>
        </div>
        {(cartTotal.totalDiscount + cartTotal.couponDiscount) > 0 && (
          <div className="flex justify-between text-red-500">
            <span>할인 금액</span>
            <span>-{formatCurrency(cartTotal.totalDiscount + cartTotal.couponDiscount)}</span>
          </div>
        )}
        <div className="flex justify-between py-2 border-t border-gray-200">
          <span className="font-semibold">결제 예정 금액</span>
          <span className="font-bold text-lg text-gray-900">{formatCurrency(cartTotal.finalTotal)}</span>
        </div>
      </div>

      <button
        onClick={onCheckout}
        className="w-full mt-4 py-3 bg-yellow-400 text-gray-900 rounded-md font-medium hover:bg-yellow-500 transition-colors"
      >
        {formatCurrency(cartTotal.finalTotal)} 결제하기
      </button>

      <div className="mt-3 text-xs text-gray-500 text-center">
        <p>* 실제 결제는 이루어지지 않습니다</p>
      </div>
    </section>
  )
}
