import { useAtomValue } from 'jotai';
import Button from '../ui/Button';
import { cartAtom } from '../../atoms/cartAtom';
import { selectedCouponAtom } from '../../atoms/couponsAtom';
import { calculateCartTotal } from '../../utils/calculations/cartCalculations';
import useCheckout from '../../hooks/checkout/useCheckout';

export default function Checkout() {
  // atom에서 상태 가져오기
  const cart = useAtomValue(cartAtom);
  const selectedCoupon = useAtomValue(selectedCouponAtom);

  // 커스텀 훅에서 함수 가져오기
  const { completeOrder } = useCheckout();

  // 계산된 값
  const totals = calculateCartTotal(cart, selectedCoupon);

  return (
    <section className='bg-white rounded-lg border border-gray-200 p-4'>
      <h3 className='text-lg font-semibold mb-4'>결제 정보</h3>
      <div className='space-y-2 text-sm'>
        <div className='flex justify-between'>
          <span className='text-gray-600'>상품 금액</span>
          <span className='font-medium'>{totals.totalBeforeDiscount.toLocaleString()}원</span>
        </div>
        {totals.totalBeforeDiscount - totals.totalAfterDiscount > 0 && (
          <div className='flex justify-between text-red-500'>
            <span>할인 금액</span>
            <span>
              -{(totals.totalBeforeDiscount - totals.totalAfterDiscount).toLocaleString()}원
            </span>
          </div>
        )}
        <div className='flex justify-between py-2 border-t border-gray-200'>
          <span className='font-semibold'>결제 예정 금액</span>
          <span className='font-bold text-lg text-gray-900'>
            {totals.totalAfterDiscount.toLocaleString()}원
          </span>
        </div>
      </div>

      {/* Todo :: primary - lg 사이즈 옵션 수정 */}
      <Button
        onClick={completeOrder}
        size='lg'
        className='w-full hover:bg-yellow-500 bg-yellow-400 !text-gray-900 mt-4 py-3'
      >
        {totals.totalAfterDiscount.toLocaleString()}원 결제하기
      </Button>

      <div className='mt-3 text-xs text-gray-500 text-center'>
        <p>* 실제 결제는 이루어지지 않습니다</p>
      </div>
    </section>
  );
}
