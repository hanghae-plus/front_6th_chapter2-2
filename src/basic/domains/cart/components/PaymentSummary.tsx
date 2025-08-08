import { CheckoutButton } from "./CheckoutButton";
import { PaymentInfoLine } from "./PaymentInfoLine";

type PaymentSummaryProps = {
  totals: {
    totalBeforeDiscount: number;
    totalAfterDiscount: number;
  };
  completeOrder: () => void;
};

export function PaymentSummary({ totals, completeOrder }: PaymentSummaryProps) {
  const handleCompleteOrder = () => {
    completeOrder();
  };

  const discountAmount = totals.totalBeforeDiscount - totals.totalAfterDiscount;

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-4">
      <h3 className="mb-4 text-lg font-semibold">결제 정보</h3>
      <div className="space-y-2 text-sm">
        <PaymentInfoLine
          label="상품 금액"
          value={`${totals.totalBeforeDiscount.toLocaleString()}원`}
        />
        {discountAmount > 0 && (
          <PaymentInfoLine
            label="할인 금액"
            value={`-${discountAmount.toLocaleString()}원`}
            variant="highlighted"
          />
        )}
        <PaymentInfoLine
          label="결제 예정 금액"
          value={`${totals.totalAfterDiscount.toLocaleString()}원`}
          variant="total"
        />
      </div>

      <CheckoutButton
        totalAmount={totals.totalAfterDiscount}
        onCompleteOrder={handleCompleteOrder}
      />
    </section>
  );
}
