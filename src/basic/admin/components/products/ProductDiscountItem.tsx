import { Discount } from '../../../shared/types';

export const ProductDiscountItem = ({
  discount,
  index,
  changeDiscountQuantity,
  changeDiscountRate,
  removeDiscount,
}: {
  discount: Discount;
  index: number;
  changeDiscountQuantity: (index: number, quantity: number) => void;
  changeDiscountRate: (index: number, percent: number) => void;
  removeDiscount: (index: number) => void;
}) => {
  return (
    <div key={index} className="flex items-center gap-2 bg-gray-50 p-2 rounded">
      <input
        type="number"
        value={discount.quantity}
        onChange={e => changeDiscountQuantity(index, parseInt(e.target.value))}
        className="w-20 px-2 py-1 border rounded"
        min="1"
        placeholder="수량"
      />
      <span className="text-sm">개 이상 구매 시</span>
      <input
        type="number"
        value={discount.rate * 100}
        onChange={e => changeDiscountRate(index, parseInt(e.target.value))}
        className="w-16 px-2 py-1 border rounded"
        min="0"
        max="100"
        placeholder="%"
      />
      <span className="text-sm">% 할인</span>
      <button
        type="button"
        onClick={() => removeDiscount(index)}
        className="text-red-600 hover:text-red-800"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
};
