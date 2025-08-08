import { useAtom, useSetAtom } from 'jotai';

import {
  cartAtom,
  clearCartAtom,
  pushNotificationAtom,
  selectedCouponAtom,
} from '../../store/atoms';
import { calculateCartTotal } from '../../utils/calculator';
import { formatPrice } from '../../utils/formatters';

export default function PaymentSummary() {
  const [cart] = useAtom(cartAtom);
  const [selectedCoupon, setSelectedCoupon] = useAtom(selectedCouponAtom);

  const clearCart = useSetAtom(clearCartAtom);
  const pushNotification = useSetAtom(pushNotificationAtom);

  const totals = calculateCartTotal(cart, selectedCoupon || undefined);
  const discountAmount = totals.totalBeforeDiscount - totals.totalAfterDiscount;
  const hasDiscount = discountAmount > 0;

  const onCompleteOrder = () => {
    const orderNumber = `ORD-${Date.now()}`;
    pushNotification({
      message: `주문이 완료되었습니다. 주문번호: ${orderNumber}`,
      type: 'success',
    });
    clearCart();
    setSelectedCoupon(null);
  };

  return (
    <section className='bg-white rounded-lg border border-gray-200 p-4'>
      <h3 className='text-lg font-semibold mb-4'>결제 정보</h3>
      <div className='space-y-2 text-sm'>
        <div className='flex justify-between'>
          <span className='text-gray-600'>상품 금액</span>
          <span className='font-medium'>{formatPrice(totals.totalBeforeDiscount)}</span>
        </div>
        {hasDiscount && (
          <div className='flex justify-between text-red-500'>
            <span>할인 금액</span>
            <span>-{formatPrice(discountAmount)}</span>
          </div>
        )}
        <div className='flex justify-between py-2 border-t border-gray-200'>
          <span className='font-semibold'>결제 예정 금액</span>
          <span className='font-bold text-lg text-gray-900'>
            {formatPrice(totals.totalAfterDiscount)}
          </span>
        </div>
      </div>

      <button
        onClick={onCompleteOrder}
        className='w-full mt-4 py-3 bg-yellow-400 text-gray-900 rounded-md font-medium hover:bg-yellow-500 transition-colors'
      >
        {formatPrice(totals.totalAfterDiscount)} 결제하기
      </button>

      <div className='mt-3 text-xs text-gray-500 text-center'>
        <p>* 실제 결제는 이루어지지 않습니다</p>
      </div>
    </section>
  );
}
