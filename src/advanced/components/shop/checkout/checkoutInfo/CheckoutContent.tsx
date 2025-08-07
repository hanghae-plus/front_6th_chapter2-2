import { useCallback } from 'react';
import Button from '../../../ui/Button.tsx';
import { addNotificationAtom } from '../../../../store/common/notification.store.ts';
import { useSetAtom } from 'jotai/index';
import { resetCartAtom } from '../../../../store/entities/cart.store.ts';
import { resetCouponAtom } from '../../../../store/entities/coupon.store.ts';
interface totalType {
  totalBeforeDiscount: number;
  totalAfterDiscount: number;
}

const CheckoutContent = ({ totals }: { totals: totalType }) => {
  const addNotification = useSetAtom(addNotificationAtom);
  const onResetCart = useSetAtom(resetCartAtom);
  const resetCoupon = useSetAtom(resetCouponAtom);

  const completeOrder = useCallback(() => {
    const orderNumber = `ORD-${Date.now()}`;
    addNotification({
      message: `주문이 완료되었습니다. 주문번호: ${orderNumber}`,
      type: 'success',
    });
    onResetCart();
    resetCoupon();
  }, [addNotification]);
  return (
    <>
      <h3 className="text-lg font-semibold mb-4">결제 정보</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">상품 금액</span>
          <span className="font-medium">
            {totals.totalBeforeDiscount.toLocaleString()}원
          </span>
        </div>
        {totals.totalBeforeDiscount - totals.totalAfterDiscount > 0 && (
          <div className="flex justify-between text-red-500">
            <span>할인 금액</span>
            <span>
              -
              {(
                totals.totalBeforeDiscount - totals.totalAfterDiscount
              ).toLocaleString()}
              원
            </span>
          </div>
        )}
        <div className="flex justify-between py-2 border-t border-gray-200">
          <span className="font-semibold">결제 예정 금액</span>
          <span className="font-bold text-lg text-gray-900">
            {totals.totalAfterDiscount.toLocaleString()}원
          </span>
        </div>
      </div>

      <Button
        onClick={completeOrder}
        className="w-full mt-4 py-3 bg-yellow-400 text-gray-900 rounded-md font-medium hover:bg-yellow-500 transition-colors"
      >
        {totals.totalAfterDiscount.toLocaleString()}원 결제하기
      </Button>

      <div className="mt-3 text-xs text-gray-500 text-center">
        <p>* 실제 결제는 이루어지지 않습니다</p>
      </div>
    </>
  );
};

export default CheckoutContent;
