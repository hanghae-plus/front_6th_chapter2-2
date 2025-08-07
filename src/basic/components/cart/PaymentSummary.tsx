import { hasTotalDiscount, calculateTotalDiscountAmount } from '../../models/discount';
import Button from '../ui/Button';
import Card from '../ui/Card';

interface CartTotal {
  totalBeforeDiscount: number;
  totalAfterDiscount: number;
}

interface PaymentSummaryProps {
  totals: CartTotal;
  handleCompleteOrder: () => void;
}

const PaymentSummary = ({ totals, handleCompleteOrder }: PaymentSummaryProps) => {
  return (
    <Card
      padding='sm'
      headerStyle='margin'
      header={<h3 className='text-lg font-semibold mb-4'>결제 정보</h3>}
    >
      <div className='space-y-2 text-sm'>
        <div className='flex justify-between'>
          <span className='text-gray-600'>상품 금액</span>
          <span className='font-medium'>{totals.totalBeforeDiscount.toLocaleString()}원</span>
        </div>
        {hasTotalDiscount(totals.totalBeforeDiscount, totals.totalAfterDiscount) && (
          <div className='flex justify-between text-red-500'>
            <span>할인 금액</span>
            <span>
              -
              {calculateTotalDiscountAmount(
                totals.totalBeforeDiscount,
                totals.totalAfterDiscount
              ).toLocaleString()}
              원
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

      <Button
        onClick={handleCompleteOrder}
        hasFontMedium
        hasTransition
        hasRounded
        className='w-full mt-4 py-3 bg-yellow-400 text-gray-900 rounded-md hover:bg-yellow-500'
      >
        {totals.totalAfterDiscount.toLocaleString()}원 결제하기
      </Button>

      <div className='mt-3 text-xs text-gray-500 text-center'>
        <p>* 실제 결제는 이루어지지 않습니다</p>
      </div>
    </Card>
  );
};

export default PaymentSummary;
