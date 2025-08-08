import type { ChangeEvent } from "react";

import { CloseIcon } from "../../../shared";
import { type Discount } from "../types";

type DiscountItemProps = {
  discount: Discount;
  index: number;
  onChange: (index: number, field: "quantity" | "rate", value: number) => void;
  onRemove: (index: number) => void;
};

export function DiscountItem({ discount, index, onChange, onRemove }: DiscountItemProps) {
  const handleQuantityChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onChange(index, "quantity", parseInt(value) || 0);
  };

  const handleRateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onChange(index, "rate", (parseInt(value) || 0) / 100);
  };

  const handleRemove = () => {
    onRemove(index);
  };

  return (
    <div className="flex items-center gap-2 rounded bg-gray-50 p-2">
      <input
        type="number"
        value={discount.quantity}
        onChange={handleQuantityChange}
        className="w-20 rounded border px-2 py-1"
        min="1"
        placeholder="수량"
      />
      <span className="text-sm">개 이상 구매 시</span>
      <input
        type="number"
        value={discount.rate * 100}
        onChange={handleRateChange}
        className="w-16 rounded border px-2 py-1"
        min="0"
        max="100"
        placeholder="%"
      />
      <span className="text-sm">% 할인</span>
      <button type="button" onClick={handleRemove} className="text-red-600 hover:text-red-800">
        <CloseIcon />
      </button>
    </div>
  );
}
