import { DISCOUNT_DEFAULTS } from '@/models/discount';
import { Button, NumberInput } from '@/shared/ui';

type DiscountPolicy = {
  quantity: number;
  rate: number;
};

type Props = {
  discounts: DiscountPolicy[];
  onChange: (discounts: DiscountPolicy[]) => void;
  className?: string;
};

export const DiscountPolicy = ({
  discounts,
  onChange,
  className = ''
}: Props) => {
  const handleQuantityChange = (index: number, quantity: number) => {
    const newDiscounts = [...discounts];
    newDiscounts[index].quantity = quantity;
    onChange(newDiscounts);
  };

  const handleRateChange = (index: number, rate: number) => {
    const newDiscounts = [...discounts];
    newDiscounts[index].rate = rate / 100;
    onChange(newDiscounts);
  };

  const handleDelete = (index: number) => {
    const newDiscounts = discounts.filter((_, i) => i !== index);
    onChange(newDiscounts);
  };

  const handleAdd = () => {
    onChange([
      ...discounts,
      { quantity: DISCOUNT_DEFAULTS.QUANTITY, rate: DISCOUNT_DEFAULTS.RATE }
    ]);
  };

  return (
    <div className={className}>
      <div className='space-y-2'>
        {discounts.map((discount, index) => (
          <div
            key={`discount-${discount.quantity}-${discount.rate}-${index}`}
            className='flex items-center gap-2 bg-gray-50 p-2 rounded'>
            <NumberInput
              value={discount.quantity}
              onChange={value => handleQuantityChange(index, value)}
              className='w-20 px-2 py-1 border rounded'
              min={1}
              placeholder='수량'
            />
            <span className='text-sm'>개 이상 구매 시</span>
            <NumberInput
              value={discount.rate * 100}
              onChange={value => handleRateChange(index, value)}
              className='w-16 px-2 py-1 border rounded'
              min={0}
              max={100}
              placeholder='%'
            />
            <span className='text-sm'>% 할인</span>
            <button
              type='button'
              onClick={() => handleDelete(index)}
              className='text-red-600 hover:text-red-800'>
              <svg
                className='w-4 h-4'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            </button>
          </div>
        ))}
        <Button
          type='button'
          variant='secondary'
          onClick={handleAdd}
          className='text-sm text-indigo-600 hover:text-indigo-800'>
          + 할인 추가
        </Button>
      </div>
    </div>
  );
};
