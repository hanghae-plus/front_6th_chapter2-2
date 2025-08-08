import { Button } from "../ui/button/Button";
import type { ProductDiscount } from "../../types/admin";

interface DiscountItemProps {
  discount: ProductDiscount;
  index: number;
  onQuantityChange: (index: number, quantity: number) => void;
  onRateChange: (index: number, rate: number) => void;
  onRemove: (index: number) => void;
}

export const DiscountItem = ({ discount, index, onQuantityChange, onRateChange, onRemove }: DiscountItemProps) => {
  return (
    <div className="flex items-center gap-2 bg-gray-50 p-2 rounded">
      <input
        type="number"
        value={discount.quantity}
        onChange={(e) => onQuantityChange(index, parseInt(e.target.value) || 0)}
        className="w-20 px-2 py-1 border rounded"
        min="1"
        placeholder="수량"
      />
      <span className="text-sm">개 이상 구매 시</span>
      <input
        type="number"
        value={discount.rate * 100}
        onChange={(e) => onRateChange(index, (parseInt(e.target.value) || 0) / 100)}
        className="w-16 px-2 py-1 border rounded"
        min="0"
        max="100"
        placeholder="%"
      />
      <span className="text-sm">% 할인</span>
      <Button variant="danger" size="sm" onClick={() => onRemove(index)} className="p-1">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </Button>
    </div>
  );
};
