import { useCallback } from "react";
import { useCart, useCartActions } from "../../../hooks/useCart";
import { calculateCartTotal } from "../../../models/cart";
import Button from "../../../components/ui/Button";
import { useNotificationActions } from "../../../hooks/useNotification";
import { useCoupon } from "../../../hooks/useCoupon";

const PaymentSection = () => {
  const { cart } = useCart();
  const { selectedCoupon } = useCoupon();
  const { clearCart } = useCartActions();
  const { addNotification } = useNotificationActions();
  const totalPaymentAmount = calculateCartTotal(cart, selectedCoupon);

  const completeOrder = useCallback(() => {
    const orderNumber = `ORD-${Date.now()}`;

    addNotification(
      `주문이 완료되었습니다. 주문번호: ${orderNumber}`,
      "success"
    );

    clearCart();
  }, [addNotification, clearCart]);

  return (
    <>
      {cart.length > 0 && (
        <section className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-lg font-semibold mb-4">결제 정보</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">상품 금액</span>
              <span className="font-medium">
                {totalPaymentAmount.totalBeforeDiscount.toLocaleString()}원
              </span>
            </div>
            {totalPaymentAmount.totalBeforeDiscount -
              totalPaymentAmount.totalAfterDiscount >
              0 && (
              <div className="flex justify-between text-red-500">
                <span>할인 금액</span>
                <span>
                  -
                  {(
                    totalPaymentAmount.totalBeforeDiscount -
                    totalPaymentAmount.totalAfterDiscount
                  ).toLocaleString()}
                  원
                </span>
              </div>
            )}
            <div className="flex justify-between py-2 border-t border-gray-200">
              <span className="font-semibold">결제 예정 금액</span>
              <span className="font-bold text-lg text-gray-900">
                {totalPaymentAmount.totalAfterDiscount.toLocaleString()}원
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
            {totalPaymentAmount.totalAfterDiscount.toLocaleString()}원 결제하기
          </Button>

          <div className="mt-3 text-xs text-gray-500 text-center">
            <p>* 실제 결제는 이루어지지 않습니다</p>
          </div>
        </section>
      )}
    </>
  );
};

export default PaymentSection;
