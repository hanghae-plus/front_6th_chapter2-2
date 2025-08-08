import type { Discount } from "../types";
import { DiscountItem } from "./DiscountItem";

type DiscountSectionProps = {
  discounts: Discount[];
  onChange: (discounts: Discount[]) => void;
};

export function DiscountSection({ discounts, onChange }: DiscountSectionProps) {
  const handleDiscountChange = (index: number, field: "quantity" | "rate", value: number) => {
    const newDiscounts = [...discounts];
    newDiscounts[index][field] = value;
    onChange(newDiscounts);
  };

  const handleRemoveDiscount = (index: number) => {
    const newDiscounts = discounts.filter((_, i) => i !== index);
    onChange(newDiscounts);
  };

  const handleAddDiscount = () => {
    onChange([...discounts, { quantity: 10, rate: 0.1 }]);
  };

  return (
    <div className="mt-4">
      <label className="mb-2 block text-sm font-medium text-gray-700">할인 정책</label>
      <div className="space-y-2">
        {discounts.map((discount, index) => (
          <DiscountItem
            key={index}
            discount={discount}
            index={index}
            onChange={handleDiscountChange}
            onRemove={handleRemoveDiscount}
          />
        ))}
        <button
          type="button"
          onClick={handleAddDiscount}
          className="text-sm text-indigo-600 hover:text-indigo-800"
        >
          + 할인 추가
        </button>
      </div>
    </div>
  );
}
