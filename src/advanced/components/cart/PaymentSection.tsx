import { Button, PriceDisplay } from "../ui";
import { couponUtils } from "../../utils/couponUtils";

interface PaymentSectionProps {
  totalBeforeDiscount: number;
  totalAfterDiscount: number;
  completeOrder: () => void;
  className?: string;
}

export default function PaymentSection({
  totalBeforeDiscount,
  totalAfterDiscount,
  completeOrder,
  className = "",
}: PaymentSectionProps) {
  const discountAmount = couponUtils.getDiscountAmount(
    totalBeforeDiscount,
    totalAfterDiscount
  );
  const hasDiscountApplied = couponUtils.hasDiscount(
    totalBeforeDiscount,
    totalAfterDiscount
  );

  return (
    <section
      className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}
    >
      <h3 className="text-lg font-semibold mb-4">결제 정보</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">상품 금액</span>
          <PriceDisplay price={totalBeforeDiscount} size="small" />
        </div>
        {hasDiscountApplied && (
          <div className="flex justify-between items-center text-red-500">
            <span>할인 금액</span>
            <span>-{discountAmount.toLocaleString()}원</span>
          </div>
        )}
        <div className="flex justify-between items-center py-2 border-t border-gray-200">
          <span className="font-semibold">결제 예정 금액</span>
          <PriceDisplay price={totalAfterDiscount} size="large" />
        </div>
      </div>

      <Button onClick={completeOrder} variant="yellow" className="w-full mt-4">
        {totalAfterDiscount.toLocaleString()}원 결제하기
      </Button>

      <div className="mt-3 text-xs text-gray-500 text-center">
        <p>* 실제 결제는 이루어지지 않습니다</p>
      </div>
    </section>
  );
}
