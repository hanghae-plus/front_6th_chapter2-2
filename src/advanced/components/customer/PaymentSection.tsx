import { useAtom, useSetAtom } from "jotai";
import { useCallback } from "react";
import { cartAtom } from "../../atoms/cartAtoms";
import { selectedCouponAtom } from "../../atoms/couponAtoms";
import { useCart } from "../../hooks/useCart";
import { useCartTotals } from "../../hooks/useCartTotals";
import { useNotification } from "../../hooks/useNotification";
import { useProduct } from "../../hooks/useProduct";
import { generateOrderNumber } from "../../utils/orderUtils";

export const PaymentSection = () => {
  /** 장바구니 상태 - Jotai 사용 */
  const setCart = useSetAtom(cartAtom);

  /** 선택된 쿠폰 - Jotai 사용 */
  const setSelectedCoupon = useSetAtom(selectedCouponAtom);

  /** 상품 데이터 - useProduct hook 사용 */
  const { products } = useProduct();

  /** 장바구니 관련 actions - useCart hook 사용 */
  const { calculateItemTotal } = useCart({ products });

  /** 장바구니 총액 계산 - 직접 hook 사용 */
  const totals = useCartTotals({ calculateItemTotal });

  /** 알림 표시 */
  const { showToast } = useNotification();

  /** 주문 완료 */
  const completeOrder = useCallback(() => {
    const orderNumber = generateOrderNumber();
    showToast(`주문이 완료되었습니다. 주문번호: ${orderNumber}`, "success");
    setCart([]);
    setSelectedCoupon(null);
  }, [showToast, setCart, setSelectedCoupon]);

  const { totalBeforeDiscount, totalAfterDiscount } = totals;

  return (
    <section className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-lg font-semibold mb-4">결제 정보</h3>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">상품 금액</span>
          <span className="font-medium">{totalBeforeDiscount.toLocaleString()}원</span>
        </div>

        {totalBeforeDiscount - totalAfterDiscount > 0 && (
          <div className="flex justify-between text-red-500">
            <span>할인 금액</span>
            <span>-{(totalBeforeDiscount - totalAfterDiscount).toLocaleString()}원</span>
          </div>
        )}

        <div className="flex justify-between py-2 border-t border-gray-200">
          <span className="font-semibold">결제 예정 금액</span>
          <span className="font-bold text-lg text-gray-900">{totalAfterDiscount.toLocaleString()}원</span>
        </div>
      </div>

      {/* 결제 버튼 */}
      <button onClick={completeOrder} className="w-full mt-4 py-3 bg-yellow-400 text-gray-900 rounded-md font-medium hover:bg-yellow-500 transition-colors">
        {totalAfterDiscount.toLocaleString()}원 결제하기
      </button>

      <div className="mt-3 text-xs text-gray-500 text-center">
        <p>* 실제 결제는 이루어지지 않습니다</p>
      </div>
    </section>
  );
};
